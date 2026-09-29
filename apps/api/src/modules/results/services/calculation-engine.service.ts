import { Injectable } from '@nestjs/common';
import { GradeBoundary } from '@prisma/client';

export interface CalculatedMark {
  resultId: string;
  studentId: string;
  rawMark: number;
  grade: string;
  gradePoints: number;
  position?: number;
}

@Injectable()
export class CalculationEngineService {
  /**
   * Assigns grade and grade points based on configured boundaries.
   */
  assignGrade(mark: number, boundaries: GradeBoundary[]): { grade: string; gradePoints: number } {
    for (const b of boundaries) {
      if (mark >= b.minMark && mark <= b.maxMark) {
        return { grade: b.grade, gradePoints: b.gradePoints };
      }
    }
    // Fallback if mark does not fall in exact interval
    return { grade: 'F', gradePoints: 0.0 };
  }

  /**
   * Computes ranks/positions using Standard Competition Ranking (1224) if position ranking is enabled.
   */
  calculatePositions(
    results: Array<{ id: string; studentId: string; rawMark: number }>,
    boundaries: GradeBoundary[],
    positionEnabled: boolean,
  ): CalculatedMark[] {
    // Sort descending by raw mark
    const sorted = [...results].sort((a, b) => b.rawMark - a.rawMark);

    const calculated: CalculatedMark[] = [];
    let currentRank = 1;

    for (let i = 0; i < sorted.length; i++) {
      const item = sorted[i];
      const { grade, gradePoints } = this.assignGrade(item.rawMark, boundaries);

      if (positionEnabled) {
        // Standard competition ranking: if mark equals previous mark, rank is identical
        if (i > 0 && item.rawMark === sorted[i - 1].rawMark) {
          calculated.push({
            resultId: item.id,
            studentId: item.studentId,
            rawMark: item.rawMark,
            grade,
            gradePoints,
            position: calculated[i - 1].position,
          });
        } else {
          currentRank = i + 1;
          calculated.push({
            resultId: item.id,
            studentId: item.studentId,
            rawMark: item.rawMark,
            grade,
            gradePoints,
            position: currentRank,
          });
        }
      } else {
        calculated.push({
          resultId: item.id,
          studentId: item.studentId,
          rawMark: item.rawMark,
          grade,
          gradePoints,
        });
      }
    }

    return calculated;
  }
}
