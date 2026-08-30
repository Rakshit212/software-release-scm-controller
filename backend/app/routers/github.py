from fastapi import APIRouter, Depends, HTTPException
import httpx
import os
from typing import List, Dict, Any

router = APIRouter(prefix="/api/github", tags=["github"])

GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
GITHUB_OWNER = os.getenv("GITHUB_OWNER", "example-owner")
GITHUB_REPO = os.getenv("GITHUB_REPO", "example-repo")

def get_github_headers():
    if not GITHUB_TOKEN:
        return {}
    return {
        "Authorization": f"token {GITHUB_TOKEN}",
        "Accept": "application/vnd.github.v3+json"
    }

@router.get("/commits", response_model=List[Dict[Any, Any]])
async def get_commits():
    if not GITHUB_TOKEN or GITHUB_TOKEN == "your_github_personal_access_token":
        # Mock data for demonstration without token
        return [
            {"sha": "a1b2c3d4", "commit": {"message": "Fix authentication bug", "author": {"name": "Rakshit", "date": "2026-08-30T10:00:00Z"}}},
            {"sha": "b2c3d4e5", "commit": {"message": "Add dashboard filtering", "author": {"name": "Rakshit", "date": "2026-08-29T14:30:00Z"}}},
            {"sha": "c3d4e5f6", "commit": {"message": "Improve API performance", "author": {"name": "Admin", "date": "2026-08-28T09:15:00Z"}}}
        ]
        
    url = f"https://api.github.com/repos/{GITHUB_OWNER}/{GITHUB_REPO}/commits"
    async with httpx.AsyncClient() as client:
        response = await client.get(url, headers=get_github_headers())
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail="Failed to fetch commits from GitHub")
        return response.json()[:10] # Return top 10

@router.get("/releases", response_model=List[Dict[Any, Any]])
async def get_github_releases():
    if not GITHUB_TOKEN or GITHUB_TOKEN == "your_github_personal_access_token":
        return [
            {"tag_name": "v2.3.0", "name": "Release v2.3.0", "published_at": "2026-08-30T12:00:00Z"},
            {"tag_name": "v2.2.0", "name": "Release v2.2.0", "published_at": "2026-08-15T12:00:00Z"}
        ]
        
    url = f"https://api.github.com/repos/{GITHUB_OWNER}/{GITHUB_REPO}/releases"
    async with httpx.AsyncClient() as client:
        response = await client.get(url, headers=get_github_headers())
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail="Failed to fetch releases from GitHub")
        return response.json()
