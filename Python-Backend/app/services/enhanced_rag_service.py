"""
Enhanced RAG Service with Agentic Tools and Chart Generation
Combines retrieval, tool calling, and structured output
"""

from typing import List, Dict, Optional, Any
from langchain_openai import ChatOpenAI
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.documents import Document
import json
import re

from app.config.settings import settings
from app.services.vector_store import vector_store
from app.agent.orchestrator import agent_orchestrator
from app.models.schemas import ChartData, Citation
import traceback


class EnhancedRAGService:
    """
    Enhanced RAG Service with:
    - Agentic tool calling for calculations
    - Automatic chart data generation
    - Source citations
    """
    
    def __init__(self):
        """Initialize enhanced RAG service with configured provider"""
        if settings.LLM_PROVIDER.lower() == "openai" and settings.OPENAI_API_KEY:
            print(f"[LLM] Initializing OpenAI {settings.LLM_MODEL}")
            self.llm = ChatOpenAI(
                model=settings.LLM_MODEL,
                temperature=settings.LLM_TEMPERATURE,
                max_tokens=settings.LLM_MAX_TOKENS,
                openai_api_key=settings.OPENAI_API_KEY,
            )
        else:
            # Default: Use Groq (free, fast, no billing required)
            print(f"[LLM] Initializing Groq {settings.LLM_MODEL}")
            self.llm = ChatOpenAI(
                model=settings.LLM_MODEL,
                temperature=settings.LLM_TEMPERATURE,
                max_tokens=settings.LLM_MAX_TOKENS,
                openai_api_key=settings.GROQ_API_KEY,
                openai_api_base="https://api.groq.com/openai/v1",
            )
    
    def _format_documents(self, docs: List[Document]) -> str:
        """Format retrieved documents into context string with truncation"""
        if not docs:
            return "No relevant context found."
        
        # Limit total docs to prevent token overflow (max 10 chunks total)
        docs = docs[:10]
        
        formatted = "\n\n---\n\n".join([
            f"[Page {doc.metadata.get('page', 'N/A')}] {doc.page_content}"
            for doc in docs
        ])
        
        # Absolute truncation based on characters to protect rate limits
        if len(formatted) > settings.MAX_CONTEXT_CHARACTERS:
            print(f"[WARNING] Context truncated from {len(formatted)} to {settings.MAX_CONTEXT_CHARACTERS} characters")
            formatted = formatted[:settings.MAX_CONTEXT_CHARACTERS] + "\n\n[Context truncated due to size limits...]"
            
        return formatted
    
    def _extract_citations(self, docs: List[Document]) -> List[Citation]:
        """Extract citations from retrieved documents"""
        citations = []
        
        for doc in docs[:3]:  # Top 3 most relevant
            citations.append(Citation(
                page=doc.metadata.get('page', 0),
                snippet=doc.page_content[:200] + "..." if len(doc.page_content) > 200 else doc.page_content,
                confidence=doc.metadata.get('score', 1.0)
            ))
        
        return citations
    
    def _detect_chart_opportunity(self, question: str, context: str) -> bool:
        """
        Detect if question involves time-series or comparative data
        that would benefit from visualization
        """
        # Keywords that suggest chart-worthy data
        chart_keywords = [
            'trend', 'growth', 'over time', 'comparison', 'compare',
            'year', 'quarter', 'month', 'period', 'historical',
            'revenue', 'profit', 'sales', 'performance', 'change'
        ]
        
        question_lower = question.lower()
        
        # Check if question contains chart keywords
        has_chart_keyword = any(keyword in question_lower for keyword in chart_keywords)
        
        # Check if context has multiple numbers (potential data series)
        numbers_in_context = re.findall(r'\d+(?:,\d{3})*(?:\.\d+)?', context)
        has_multiple_numbers = len(numbers_in_context) >= 3
        
        return has_chart_keyword and has_multiple_numbers
    
    async def _generate_chart_data(
        self,
        question: str,
        context: str,
        answer: str
    ) -> Optional[ChartData]:
        """
        Generate chart data from context and answer
        Uses LLM to extract structured data
        """
        try:
            chart_prompt = f"""Based on the following financial data, extract structured chart data if applicable.

QUESTION: {question}

CONTEXT: {context[:1000]}

ANSWER: {answer}

If the data contains time-series or comparative information suitable for a chart, respond with JSON in this EXACT format:
{{
    "type": "line|bar|pie",
    "title": "Chart Title",
    "labels": ["Label1", "Label2", "Label3"],
    "datasets": [
        {{
            "label": "Dataset Name",
            "data": [100, 150, 200],
            "color": "#3b82f6"
        }}
    ]
}}

If no chart is appropriate, respond with: {{"no_chart": true}}

Respond ONLY with valid JSON, no other text."""

            response = self.llm.invoke(chart_prompt)
            response_text = response.content.strip()
            
            # Extract JSON from response
            json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
            if not json_match:
                return None
            
            chart_json = json.loads(json_match.group())
            
            # Check if chart is appropriate
            if chart_json.get("no_chart"):
                return None
            
            # Validate required fields
            if not all(k in chart_json for k in ["type", "title", "labels", "datasets"]):
                return None
            
            return ChartData(**chart_json)
            
        except Exception as e:
            print(f"[WARNING] Chart generation failed: {e}")
            return None
    
    async def query_with_agent(
        self,
        question: str,
        chat_history: List[Dict[str, str]],
        namespaces: List[str],
        enable_tools: bool = True,
        enable_charts: bool = True
    ) -> Dict[str, Any]:
        """
        Enhanced query with agent tools and chart generation
        
        Args:
            question: User's question
            chat_history: Previous conversation
            namespaces: Document namespaces to search
            enable_tools: Enable agentic tool calling
            enable_charts: Enable chart generation
            
        Returns:
            Dictionary with answer, chart_data, citations, tool_calls
        """
        print(f"\n{'='*60}")
        print(f"📥 Enhanced Query")
        print(f"Question: {question[:100]}...")
        print(f"Tools: {'Enabled' if enable_tools else 'Disabled'}")
        print(f"Charts: {'Enabled' if enable_charts else 'Disabled'}")
        print(f"{'='*60}")
        
        # If no documents, answer from general financial knowledge
        if not namespaces:
            print("[RAG] No document namespaces provided — answering from general knowledge")
            general_answer = await self._answer_general(question, chat_history)
            return {
                "answer": general_answer,
                "chart_data": None,
                "citations": [],
                "tool_calls": []
            }
        
        # Retrieve relevant context
        print(f"[SEARCH] Searching {len(namespaces)} document(s)...")
        relevant_docs = vector_store.search(
            query=question,
            namespaces=namespaces,
            k=settings.TOP_K_RESULTS
        )
        
        if not relevant_docs:
            return {
                "answer": "I couldn't find relevant information in the uploaded documents.",
                "chart_data": None,
                "citations": [],
                "tool_calls": []
            }
        
        print(f"[OK] Retrieved {len(relevant_docs)} relevant chunks")
        
        # Format context
        context = self._format_documents(relevant_docs)
        
        # Extract citations
        citations = self._extract_citations(relevant_docs)
        
        # Decide whether to use agent with tools
        needs_calculation = any(keyword in question.lower() for keyword in [
            'calculate', 'compute', 'growth', 'ratio', 'margin', 'cagr',
            'percentage', 'increase', 'decrease', 'change', 'compare'
        ])
        
        if enable_tools and needs_calculation:
            # Use agent with tools
            print("[AGENT] Using agent with tools")
            result = await agent_orchestrator.run_agent(
                question=question,
                context=context,
                chat_history=chat_history
            )
            answer = result["answer"]
            tool_calls = result["tool_calls"]
        else:
            # Use standard RAG
            print("[RAG] Using standard RAG (no tools needed)")
            prompt = PromptTemplate.from_template("""You are a financial analyst AI assistant.

CONTEXT FROM DOCUMENTS:
{context}

QUESTION: {question}

Provide a clear, accurate answer based on the context. Cite page numbers when possible.

ANSWER:""")
            
            chain = prompt | self.llm | StrOutputParser()
            answer = chain.invoke({
                "context": context,
                "question": question
            })
            tool_calls = []
        
        # Generate chart data if appropriate
        chart_data = None
        if enable_charts and self._detect_chart_opportunity(question, context):
            print("[CHART] Generating chart data...")
            chart_data = await self._generate_chart_data(question, context, answer)
            if chart_data:
                print(f"[OK] Chart generated: {chart_data.type} - {chart_data.title}")
        
        print(f"\n{'='*60}")
        print(f"[OK] Query completed")
        print(f"Tool calls: {len(tool_calls)}")
        print(f"Chart: {'Yes' if chart_data else 'No'}")
        print(f"Citations: {len(citations)}")
        print(f"{'='*60}\n")
        
        return {
            "answer": answer,
            "chart_data": chart_data,
            "citations": citations,
            "tool_calls": tool_calls
        }

    async def _answer_general(
        self,
        question: str,
        chat_history: List[Dict[str, str]] = None
    ) -> str:
        """
        Answer a question from general LLM knowledge when no documents are uploaded.
        Useful for financial concepts, formulas, and general questions.
        """
        from langchain_core.messages import HumanMessage, AIMessage, SystemMessage

        system_prompt = SystemMessage(content=(
            "You are a knowledgeable financial analyst AI assistant. "
            "Answer questions about finance, accounting, and business clearly and helpfully. "
            "If asked to create charts or analyze specific data from a document, "
            "politely mention that uploading a document will give more precise results, "
            "but still provide a helpful general answer."
        ))

        messages = [system_prompt]

        if chat_history:
            for msg in (chat_history or [])[-4:]:
                role = msg.get("role", "user")
                content = msg.get("content", "")
                if role == "user":
                    messages.append(HumanMessage(content=content))
                elif role == "assistant":
                    messages.append(AIMessage(content=content))

        messages.append(HumanMessage(content=question))

        response = self.llm.invoke(messages)
        return response.content if response.content else "I'm sorry, I couldn't generate a response."


# Global enhanced RAG service instance
enhanced_rag_service = EnhancedRAGService()
