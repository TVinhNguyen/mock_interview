#!/usr/bin/env python3
"""
Seed script to populate questions table with sample data
"""

import httpx
import asyncio
import os
import json

INTERVIEW_SERVICE_URL = os.getenv("INTERVIEW_SERVICE_URL", "http://localhost:8005")

SAMPLE_QUESTIONS = [
    {
        "content": "Explain the difference between lists and tuples in Python",
        "type": "behavioral",
        "difficulty": "easy",
        "tags": ["Python", "Data Structures", "Basics"],
        "solution_note": "Lists are mutable, tuples are immutable. Lists use more memory but are faster for modifications."
    },
    {
        "content": "How would you optimize a slow SQL query?",
        "type": "technical",
        "difficulty": "medium",
        "tags": ["SQL", "Database", "Performance"],
        "solution_note": "Add indexes, use EXPLAIN ANALYZE, avoid N+1 queries, optimize joins"
    },
    {
        "content": "Write a function to reverse a linked list",
        "type": "coding",
        "difficulty": "medium",
        "tags": ["Linked List", "Pointer", "Algorithm"],
        "starter_code": "class Node:\n    def __init__(self, val):\n        self.val = val\n        self.next = None\n\ndef reverse_linked_list(head):\n    # Your code here\n    pass",
        "solution_note": "Use iterative approach with three pointers or recursive approach"
    },
    {
        "content": "Design a URL shortener service",
        "type": "system_design",
        "difficulty": "hard",
        "tags": ["System Design", "Scalability", "Database"],
        "solution_note": "Consider hash generation, collision handling, TTL, caching, database schema"
    },
    {
        "content": "Tell me about a time you handled a production bug",
        "type": "behavioral",
        "difficulty": "easy",
        "tags": ["Communication", "Problem Solving"],
        "solution_note": "Use STAR method: Situation, Task, Action, Result"
    },
    {
        "content": "Implement binary search",
        "type": "coding",
        "difficulty": "easy",
        "tags": ["Algorithm", "Search", "Array"],
        "starter_code": "def binary_search(arr, target):\n    # Your code here\n    pass",
        "solution_note": "O(log n) time complexity, watch for integer overflow"
    },
    {
        "content": "Explain React hooks and when to use them",
        "type": "technical",
        "difficulty": "medium",
        "tags": ["React", "JavaScript", "Frontend"],
        "solution_note": "useState, useEffect, useContext, useReducer, custom hooks"
    },
    {
        "content": "What is Docker and why use containers?",
        "type": "technical",
        "difficulty": "easy",
        "tags": ["Docker", "DevOps", "Containerization"],
        "solution_note": "Consistency, isolation, scalability, microservices architecture"
    }
]

async def seed_questions():
    """Seed questions"""
    print(f"🌱 Seeding questions...")
    
    for question in SAMPLE_QUESTIONS:
        try:
            print(f"  📝 Question: {question['content'][:50]}...")
        except Exception as e:
            print(f"  ❌ Error: {str(e)}")
    
    print(f"\n✅ Total questions to seed: {len(SAMPLE_QUESTIONS)}")
    print("Note: Questions are seeded when templates are created with their associated questions")

if __name__ == "__main__":
    asyncio.run(seed_questions())
