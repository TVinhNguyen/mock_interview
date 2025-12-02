"""
AI-powered scoring analyzers using Gemini
"""
import os
import google.generativeai as genai
from typing import Dict, List
import json

# Configure Gemini
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-pro')
else:
    model = None

class CodeQualityAnalyzer:
    """Analyze code quality and provide score"""
    
    def analyze(self, code: str, language: str, test_results: Dict = None) -> Dict:
        """
        Analyze code quality
        
        Returns:
            Dict with score (0-100) and feedback
        """
        if not model:
            return self._fallback_analysis(code, test_results)
        
        try:
            prompt = f"""
You are a senior software engineer reviewing code from a technical interview.

Language: {language}
Code:
```{language}
{code}
```

Test Results: {json.dumps(test_results) if test_results else "No test results available"}

Analyze this code and provide:
1. Code Quality Score (0-100)
2. Specific strengths
3. Specific weaknesses or bugs
4. Suggestions for improvement

Format your response as JSON:
{{
    "score": <0-100>,
    "strengths": ["strength1", "strength2"],
    "weaknesses": ["weakness1", "weakness2"],
    "suggestions": ["suggestion1", "suggestion2"],
    "bugs": ["bug1", "bug2"]
}}
"""
            
            response = model.generate_content(prompt)
            result_text = response.text
            
            # Extract JSON from response
            start_idx = result_text.find('{')
            end_idx = result_text.rfind('}') + 1
            if start_idx != -1 and end_idx != 0:
                json_str = result_text[start_idx:end_idx]
                analysis = json.loads(json_str)
                return analysis
            else:
                return self._fallback_analysis(code, test_results)
                
        except Exception as e:
            print(f"Error in code analysis: {e}")
            return self._fallback_analysis(code, test_results)
    
    def _fallback_analysis(self, code: str, test_results: Dict = None) -> Dict:
        """Simple fallback analysis without AI"""
        score = 70  # Default score
        
        # Adjust based on test results
        if test_results:
            total = test_results.get("total", 0)
            passed = test_results.get("passed", 0)
            if total > 0:
                test_score = (passed / total) * 100
                score = int((score + test_score) / 2)
        
        return {
            "score": score,
            "strengths": ["Code executes without errors"],
            "weaknesses": ["Unable to perform detailed analysis"],
            "suggestions": ["Add more comments", "Consider edge cases"],
            "bugs": []
        }

class CommunicationAnalyzer:
    """Analyze communication skills from transcript"""
    
    def analyze(self, messages: List[Dict]) -> Dict:
        """
        Analyze communication from interview messages
        
        Args:
            messages: List of {role: 'user'/'ai', content: '...'}
        
        Returns:
            Dict with score and feedback
        """
        if not model:
            return self._fallback_analysis(messages)
        
        try:
            # Extract user messages
            user_messages = [m['content'] for m in messages if m.get('role') == 'user']
            
            if not user_messages:
                return {"score": 50, "feedback": "Insufficient communication data"}
            
            transcript = "\n".join([f"Candidate: {msg}" for msg in user_messages])
            
            prompt = f"""
You are evaluating communication skills in a technical interview.

Interview Transcript:
{transcript}

Evaluate the candidate's communication on:
1. Clarity of explanations
2. Problem-solving thought process
3. Asking clarifying questions
4. Professional tone

Provide a score (0-100) and specific feedback.

Format as JSON:
{{
    "score": <0-100>,
    "feedback": "Detailed feedback here",
    "strengths": ["strength1"],
    "areas_for_improvement": ["area1"]
}}
"""
            
            response = model.generate_content(prompt)
            result_text = response.text
            
            start_idx = result_text.find('{')
            end_idx = result_text.rfind('}') + 1
            if start_idx != -1 and end_idx != 0:
                json_str = result_text[start_idx:end_idx]
                analysis = json.loads(json_str)
                return analysis
            else:
                return self._fallback_analysis(messages)
                
        except Exception as e:
            print(f"Error in communication analysis: {e}")
            return self._fallback_analysis(messages)
    
    def _fallback_analysis(self, messages: List[Dict]) -> Dict:
        """Simple fallback without AI"""
        user_msg_count = len([m for m in messages if m.get('role') == 'user'])
        
        # More messages = better engagement
        score = min(50 + (user_msg_count * 5), 85)
        
        return {
            "score": score,
            "feedback": f"Candidate provided {user_msg_count} responses during the interview.",
            "strengths": ["Active participation"] if user_msg_count > 5 else [],
            "areas_for_improvement": ["Provide more detailed explanations"]
        }

class ProblemSolvingAnalyzer:
    """Analyze problem-solving approach"""
    
    def analyze(self, code: str, messages: List[Dict], test_results: Dict = None) -> Dict:
        """
        Analyze problem-solving skills
        
        Returns:
            Dict with score and feedback
        """
        score = 70  # Base score
        feedback_points = []
        
        # Factor 1: Test results
        if test_results:
            total = test_results.get("total", 0)
            passed = test_results.get("passed", 0)
            if total > 0:
                test_ratio = passed / total
                if test_ratio >= 0.8:
                    score += 15
                    feedback_points.append("Strong test case performance")
                elif test_ratio >= 0.5:
                    score += 5
                    feedback_points.append("Moderate test case performance")
                else:
                    score -= 10
                    feedback_points.append("Needs improvement on edge cases")
        
        # Factor 2: Code structure
        if code:
            lines = code.split('\n')
            if len(lines) > 5:  # Reasonable complexity
                score += 5
                feedback_points.append("Appropriate code structure")
            
            # Check for functions
            if 'def ' in code or 'function ' in code:
                score += 5
                feedback_points.append("Good use of functions")
        
        # Factor 3: Communication during problem-solving
        user_messages = [m for m in messages if m.get('role') == 'user']
        if len(user_messages) > 3:
            score += 5
            feedback_points.append("Clear thought process communication")
        
        score = max(0, min(100, score))  # Clamp to 0-100
        
        return {
            "score": score,
            "feedback": ". ".join(feedback_points) if feedback_points else "Analysis completed",
            "approach": "Systematic" if score > 75 else "Needs structure",
            "strengths": feedback_points[:2] if len(feedback_points) > 1 else feedback_points
        }
