from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.database import get_db
from app.models import User
from app.auth import get_current_user
from app.schemas import (
    ChallengeProfileOut, ChallengeProgressOut, AchievementOut,
    ChallengeDashboardOut
)
from app.services.challenge import ProgressService, LevelService, AchievementService

router = APIRouter(prefix="/challenge", tags=["challenge"])

@router.get("/profile", response_model=ChallengeProfileOut)
async def get_challenge_profile(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        progress = await AchievementService.get_or_create_progress(db, current_user.id)
        return ChallengeProfileOut(
            username=current_user.username,
            total_xp=progress.total_xp,
            current_streak=progress.current_streak,
            best_streak=progress.best_streak,
            quizzes_completed=progress.quizzes_completed,
            questions_answered=progress.questions_answered,
            last_activity_date=progress.last_activity_date
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch challenge profile: {str(e)}"
        )

@router.get("/progress", response_model=ChallengeProgressOut)
async def get_challenge_progress(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        progress = await AchievementService.get_or_create_progress(db, current_user.id)
        level_data = LevelService.calculate_level(progress.total_xp)
        return ChallengeProgressOut(**level_data)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch challenge progress: {str(e)}"
        )

@router.get("/achievements", response_model=List[AchievementOut])
async def get_challenge_achievements(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        dashboard = await ProgressService.get_dashboard_data(db, current_user.id)
        achievements_data = dashboard["achievements"]
        return [AchievementOut(**a) for a in achievements_data]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch achievements: {str(e)}"
        )

@router.get("/streak")
async def get_challenge_streak(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        progress = await AchievementService.get_or_create_progress(db, current_user.id)
        return {
            "current_streak": progress.current_streak,
            "best_streak": progress.best_streak,
            "last_activity_date": progress.last_activity_date
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch challenge streak: {str(e)}"
        )

@router.get("/dashboard", response_model=ChallengeDashboardOut)
async def get_challenge_dashboard(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        data = await ProgressService.get_dashboard_data(db, current_user.id)
        return ChallengeDashboardOut(**data)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch challenge dashboard: {str(e)}"
        )
