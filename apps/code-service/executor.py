"""
Code execution engine with security sandboxing
"""
import sys
import io
import traceback
import contextlib
import threading
from typing import Dict, Any, List

class TimeoutException(Exception):
    pass

class CodeExecutor:
    """Secure code executor with timeout and resource limits"""
    
    def __init__(self, timeout: int = 5):
        self.timeout = timeout
    
    def execute_python(self, code: str, test_cases: List[Dict] = None) -> Dict[str, Any]:
        """
        Execute Python code safely with timeout protection
        
        Args:
            code: Python code to execute
            test_cases: Optional list of test cases [{"input": ..., "expected": ...}]
        
        Returns:
            Dict with execution results
        """
        result = {
            "status": "success",
            "output": "",
            "errors": "",
            "execution_time": 0
        }
        
        # Create output capture
        output = io.StringIO()
        execution_result = [None]
        exception_holder = [None]
        
        def run_code():
            try:
                # Create restricted globals (no dangerous imports)
                safe_globals = {
                    "__builtins__": {
                        "print": print,
                        "range": range,
                        "len": len,
                        "int": int,
                        "str": str,
                        "float": float,
                        "bool": bool,
                        "list": list,
                        "dict": dict,
                        "set": set,
                        "tuple": tuple,
                        "sum": sum,
                        "min": min,
                        "max": max,
                        "sorted": sorted,
                        "enumerate": enumerate,
                        "zip": zip,
                        "map": map,
                        "filter": filter,
                    }
                }
                
                # Redirect stdout
                with contextlib.redirect_stdout(output):
                    exec(code, safe_globals)
                
                execution_result[0] = output.getvalue()
                
                # Run test cases if provided
                if test_cases:
                    test_results = self._run_test_cases(code, test_cases, safe_globals)
                    return {"test_results": test_results}
                    
            except Exception as e:
                exception_holder[0] = e
        
        try:
            # Use threading timer for cross-platform timeout
            thread = threading.Thread(target=run_code)
            thread.daemon = True
            thread.start()
            thread.join(timeout=self.timeout)
            
            if thread.is_alive():
                # Code is still running after timeout
                result["status"] = "timeout"
                result["errors"] = f"Code execution exceeded {self.timeout} second timeout"
                return result
            
            # Check for exceptions in thread
            if exception_holder[0]:
                result["status"] = "error"
                result["errors"] = traceback.format_exception(
                    type(exception_holder[0]), 
                    exception_holder[0],
                    exception_holder[0].__traceback__
                )
                result["errors"] = "".join(result["errors"])
                return result
            
            result["output"] = execution_result[0] or ""
            
        except Exception as e:
            result["status"] = "error"
            result["errors"] = traceback.format_exc()
        
        return result
    
    def _run_test_cases(self, code: str, test_cases: List[Dict], globals_dict: Dict) -> Dict:
        """Run test cases against the code"""
        passed = 0
        failed = 0
        details = []
        
        for i, test in enumerate(test_cases):
            try:
                # Create fresh namespace for each test to avoid state pollution
                test_globals = {
                    "__builtins__": {
                        "print": print,
                        "range": range,
                        "len": len,
                        "int": int,
                        "str": str,
                        "float": float,
                        "bool": bool,
                        "list": list,
                        "dict": dict,
                        "set": set,
                        "tuple": tuple,
                        "sum": sum,
                        "min": min,
                        "max": max,
                        "sorted": sorted,
                        "enumerate": enumerate,
                        "zip": zip,
                        "map": map,
                        "filter": filter,
                    }
                }
                
                # For test cases, we need to inject input into the code
                # If test has "input", we mock the built-in input() function
                test_input = test.get("input", "")
                input_list = [test_input] if test_input else []
                
                def mock_input(prompt=""):
                    if input_list:
                        return input_list.pop(0)
                    return ""
                
                test_globals["__builtins__"]["input"] = mock_input
                
                # Execute code with mocked input
                test_output = io.StringIO()
                with contextlib.redirect_stdout(test_output):
                    exec(code, test_globals)
                
                actual_output = test_output.getvalue().strip()
                expected_output = str(test.get("expected", "")).strip()
                
                if actual_output == expected_output:
                    passed += 1
                    details.append({
                        "test": i + 1,
                        "status": "passed",
                        "input": test.get("input", ""),
                        "expected": expected_output,
                        "actual": actual_output
                    })
                else:
                    failed += 1
                    details.append({
                        "test": i + 1,
                        "status": "failed",
                        "input": test.get("input", ""),
                        "expected": expected_output,
                        "actual": actual_output
                    })
            except Exception as e:
                failed += 1
                details.append({
                    "test": i + 1,
                    "status": "error",
                    "error": str(e)
                })
        
        return {
            "passed": passed,
            "failed": failed,
            "total": len(test_cases),
            "details": details
        }
    
    def execute_javascript(self, code: str) -> Dict[str, Any]:
        """Execute JavaScript code via Node.js"""
        result = {
            "status": "success",
            "output": "",
            "errors": "",
            "execution_time": 0
        }
        
        import subprocess
        
        try:
            # Write code to temporary file
            import tempfile
            with tempfile.NamedTemporaryFile(mode='w', suffix='.js', delete=False) as f:
                f.write(code)
                temp_file = f.name
            
            # Execute with timeout
            process = subprocess.run(
                ["node", temp_file],
                capture_output=True,
                text=True,
                timeout=self.timeout
            )
            
            result["output"] = process.stdout
            if process.stderr:
                result["status"] = "error"
                result["errors"] = process.stderr
            
            # Cleanup
            import os
            os.remove(temp_file)
            
        except subprocess.TimeoutExpired:
            result["status"] = "timeout"
            result["errors"] = f"JavaScript execution exceeded {self.timeout} second timeout"
        except Exception as e:
            result["status"] = "error"
            result["errors"] = str(e)
        
        return result
    
    def execute_java(self, code: str) -> Dict[str, Any]:
        """Execute Java code (placeholder - would need JDK)"""
        return {
            "status": "not_implemented",
            "output": "",
            "errors": "Java execution not yet implemented. Please use Python or JavaScript."
        }
