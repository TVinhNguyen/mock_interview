"""
Seed script to populate interview templates and questions
Run this after starting the services
"""
import requests
import json

INTERVIEW_SERVICE_URL = "http://localhost:8005"

# Sample Interview Templates
templates = [
    {
        "title": "Python Backend Engineer",
        "description": "Focus on Django, APIs and SQL optimization",
        "difficulty_level": "Junior",
        "topics": ["Data Structures", "APIs", "Database"],
        "estimated_minutes": 45,
        "total_questions": 8,
        "icon_slug": "python"
    },
    {
        "title": "Java Spring Developer",
        "description": "Spring Boot, Microservices, and Design Patterns",
        "difficulty_level": "Mid-Level",
        "topics": ["OOP", "Spring Boot", "Microservices"],
        "estimated_minutes": 60,
        "total_questions": 10,
        "icon_slug": "java"
    },
    {
        "title": "JavaScript Full-Stack",
        "description": "React, Node.js, and System Design",
        "difficulty_level": "Senior",
        "topics": ["React", "Node.js", "System Design"],
        "estimated_minutes": 90,
        "total_questions": 12,
        "icon_slug": "javascript"
    },
    {
        "title": "Data Structures & Algorithms",
        "description": "Core CS fundamentals for technical interviews",
        "difficulty_level": "All Levels",
        "topics": ["Arrays", "Trees", "Dynamic Programming"],
        "estimated_minutes": 60,
        "total_questions": 15,
        "icon_slug": "code"
    }
]

def seed_templates():
    """Seed interview templates"""
    print("🌱 Seeding interview templates...")
    
    for template in templates:
        try:
            response = requests.post(
                f"{INTERVIEW_SERVICE_URL}/templates",
                json=template
            )
            if response.status_code == 201:
                print(f"✅ Created template: {template['title']}")
            else:
                print(f"❌ Failed to create {template['title']}: {response.text}")
        except Exception as e:
            print(f"❌ Error: {e}")

if __name__ == "__main__":
    print("🚀 Starting seed process...")
    seed_templates()
    print("✅ Seed completed!")
