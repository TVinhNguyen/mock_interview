#!/usr/bin/env python3
"""
Seed script to populate interview_templates table with sample data
Run this after services are started
"""

import httpx
import asyncio
import os
import sys

# Service URL
INTERVIEW_SERVICE_URL = os.getenv("INTERVIEW_SERVICE_URL", "http://localhost:8005")

SAMPLE_TEMPLATES = [
    {
        "title": "Python Backend Developer",
        "description": "Focus on Django, FastAPI, APIs design and SQL optimization",
        "difficulty_level": "Junior",
        "topics": ["Python", "FastAPI", "REST APIs", "PostgreSQL", "ORM"],
        "estimated_minutes": 45,
        "total_questions": 8,
        "icon_slug": "python"
    },
    {
        "title": "Node.js Full Stack Engineer",
        "description": "Express.js, React.js, MongoDB and system design patterns",
        "difficulty_level": "Mid-Level",
        "topics": ["JavaScript", "Express.js", "React", "MongoDB", "Redux"],
        "estimated_minutes": 60,
        "total_questions": 10,
        "icon_slug": "nodejs"
    },
    {
        "title": "React Frontend Developer",
        "description": "Component design, state management, performance optimization and hooks",
        "difficulty_level": "Mid-Level",
        "topics": ["React", "JavaScript", "CSS", "State Management", "Performance"],
        "estimated_minutes": 50,
        "total_questions": 8,
        "icon_slug": "react"
    },
    {
        "title": "Java Enterprise Developer",
        "description": "Spring Boot, microservices, Java concurrency and design patterns",
        "difficulty_level": "Senior",
        "topics": ["Java", "Spring Boot", "Microservices", "Concurrency", "SQL"],
        "estimated_minutes": 75,
        "total_questions": 12,
        "icon_slug": "java"
    },
    {
        "title": "System Design & Architecture",
        "description": "Scalable system design, databases, caching, and distributed systems",
        "difficulty_level": "Senior",
        "topics": ["System Design", "Database", "Caching", "Load Balancing", "Microservices"],
        "estimated_minutes": 90,
        "total_questions": 6,
        "icon_slug": "architecture"
    },
    {
        "title": "Data Structures & Algorithms",
        "description": "Core DSA problems, coding challenges and algorithm optimization",
        "difficulty_level": "All Levels",
        "topics": ["Array", "Linked List", "Tree", "Graph", "DP"],
        "estimated_minutes": 60,
        "total_questions": 15,
        "icon_slug": "algorithm"
    },
    {
        "title": "DevOps Engineer",
        "description": "Docker, Kubernetes, CI/CD pipelines and infrastructure automation",
        "difficulty_level": "Mid-Level",
        "topics": ["Docker", "Kubernetes", "CI/CD", "AWS", "Terraform"],
        "estimated_minutes": 60,
        "total_questions": 8,
        "icon_slug": "devops"
    },
    {
        "title": "SQL & Database Expert",
        "description": "SQL optimization, indexing, query tuning and database design",
        "difficulty_level": "Senior",
        "topics": ["SQL", "PostgreSQL", "Indexing", "Performance", "Transactions"],
        "estimated_minutes": 45,
        "total_questions": 10,
        "icon_slug": "database"
    }
]

async def seed_templates():
    """Seed interview templates"""
    async with httpx.AsyncClient() as client:
        print(f"🌱 Seeding interview templates from {INTERVIEW_SERVICE_URL}...")
        
        successful = 0
        failed = 0
        
        for template in SAMPLE_TEMPLATES:
            try:
                response = await client.post(
                    f"{INTERVIEW_SERVICE_URL}/templates",
                    json=template,
                    timeout=10
                )
                
                if response.status_code == 201:
                    data = response.json()
                    print(f"✅ Created: {template['title']} ({template['difficulty_level']})")
                    successful += 1
                else:
                    print(f"❌ Failed to create {template['title']}: {response.status_code}")
                    print(f"   Response: {response.text}")
                    failed += 1
                    
            except Exception as e:
                print(f"❌ Error creating {template['title']}: {str(e)}")
                failed += 1
        
        print(f"\n📊 Seed Results:")
        print(f"   ✅ Successfully created: {successful}/{len(SAMPLE_TEMPLATES)}")
        print(f"   ❌ Failed: {failed}/{len(SAMPLE_TEMPLATES)}")
        
        return successful == len(SAMPLE_TEMPLATES)

if __name__ == "__main__":
    try:
        success = asyncio.run(seed_templates())
        sys.exit(0 if success else 1)
    except KeyboardInterrupt:
        print("\n⚠️  Seed interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Fatal error: {str(e)}")
        sys.exit(1)
