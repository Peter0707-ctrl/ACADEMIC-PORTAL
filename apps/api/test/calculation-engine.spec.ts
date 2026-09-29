import { CalculationEngineService } from '../src/modules/results/services/calculation-engine.service';
import { GradeBoundary } from '@prisma/client';

describe('CalculationEngineService (Grading & Standard Competition Ranking)', () => {
  let service: CalculationEngineService;

  const mockBoundaries: GradeBoundary[] = [
    { id: '1', gradeScaleId: 'scale1', grade: 'A', minMark: 75, maxMark: 100, gradePoints: 5.0, remarks: 'Distinction' },
    { id: '2', gradeScaleId: 'scale1', grade: 'B', minMark: 65, maxMark: 74.99, gradePoints: 4.0, remarks: 'Merit' },
    { id: '3', gradeScaleId: 'scale1', grade: 'C', minMark: 45, maxMark: 64.99, gradePoints: 3.0, remarks: 'Credit' },
    { id: '4', gradeScaleId: 'scale1', grade: 'D', minMark: 30, maxMark: 44.99, gradePoints: 2.0, remarks: 'Pass' },
    { id: '5', gradeScaleId: 'scale1', grade: 'F', minMark: 0, maxMark: 29.99, gradePoints: 1.0, remarks: 'Fail' },
  ];

  beforeEach(() => {
    service = new CalculationEngineService();
  });

  it('should correctly assign grades according to boundary intervals', () => {
    expect(service.assignGrade(92, mockBoundaries)).toEqual({ grade: 'A', gradePoints: 5.0 });
    expect(service.assignGrade(75, mockBoundaries)).toEqual({ grade: 'A', gradePoints: 5.0 });
    expect(service.assignGrade(68, mockBoundaries)).toEqual({ grade: 'B', gradePoints: 4.0 });
    expect(service.assignGrade(50, mockBoundaries)).toEqual({ grade: 'C', gradePoints: 3.0 });
    expect(service.assignGrade(35, mockBoundaries)).toEqual({ grade: 'D', gradePoints: 2.0 });
    expect(service.assignGrade(20, mockBoundaries)).toEqual({ grade: 'F', gradePoints: 1.0 });
  });

  it('should calculate standard competition ranking (1, 2, 2, 4) when position ranking is enabled', () => {
    const rawResults = [
      { id: 'r1', studentId: 's1', rawMark: 85 }, // Rank 2 (tied)
      { id: 'r2', studentId: 's2', rawMark: 95 }, // Rank 1
      { id: 'r3', studentId: 's3', rawMark: 85 }, // Rank 2 (tied)
      { id: 'r4', studentId: 's4', rawMark: 60 }, // Rank 4
    ];

    const ranked = service.calculatePositions(rawResults, mockBoundaries, true);

    expect(ranked[0].studentId).toBe('s2');
    expect(ranked[0].position).toBe(1);

    expect(ranked[1].studentId).toBe('s1');
    expect(ranked[1].position).toBe(2);

    expect(ranked[2].studentId).toBe('s3');
    expect(ranked[2].position).toBe(2);

    expect(ranked[3].studentId).toBe('s4');
    expect(ranked[3].position).toBe(4);
  });

  it('should omit position ranking when position is disabled in institution configuration', () => {
    const rawResults = [
      { id: 'r1', studentId: 's1', rawMark: 85 },
      { id: 'r2', studentId: 's2', rawMark: 95 },
    ];

    const ranked = service.calculatePositions(rawResults, mockBoundaries, false);
    expect(ranked[0].position).toBeUndefined();
    expect(ranked[1].position).toBeUndefined();
  });
});
