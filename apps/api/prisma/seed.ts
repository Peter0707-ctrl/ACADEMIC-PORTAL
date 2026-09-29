import { PrismaClient, InstitutionType, AcademicCycleType, ResultApprovalMode, StudentStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { DefaultRolePermissions } from '@academic/shared';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Commencing Database Seeding ---');

  const defaultPassword = 'Password123!';
  const passwordHash = await bcrypt.hash(defaultPassword, 10);

  // 1. Super Admin Account
  const superAdmin = await prisma.user.upsert({
    where: { email: 'superadmin@platform.edu' },
    update: {},
    data: {
      email: 'superadmin@platform.edu',
      passwordHash,
      firstName: 'Global',
      lastName: 'Administrator',
    },
  });

  const superRole = await prisma.role.upsert({
    where: { institutionId_code: { institutionId: 'SYSTEM', code: 'SUPER_ADMIN' } },
    update: {},
    data: {
      institutionId: null,
      code: 'SUPER_ADMIN',
      name: 'Super Administrator',
      isSystemRole: true,
    },
  });

  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: superAdmin.id, roleId: superRole.id } },
    update: {},
    data: { userId: superAdmin.id, roleId: superRole.id },
  });

  // 2. DEMO SECONDARY SCHOOL (Tanzania Secondary Model)
  console.log('Seeding Demo Secondary School...');
  const secondary = await prisma.institution.upsert({
    where: { code: 'TZ-SEC-KILIMANJARO' },
    update: {},
    data: {
      code: 'TZ-SEC-KILIMANJARO',
      name: 'Kilimanjaro Secondary School',
      type: InstitutionType.SECONDARY_SCHOOL,
      country: 'TZ',
      region: 'Kilimanjaro',
      district: 'Moshi',
      contactEmail: 'admin@kilimanjarosec.edu',
      contactPhone: '+255 754 112 233',
    },
  });

  await prisma.institutionSetting.upsert({
    where: { institutionId: secondary.id },
    update: {},
    data: {
      institutionId: secondary.id,
      cycleType: AcademicCycleType.TERMS,
      cyclesPerYear: 2,
      hasStreams: true,
      hasFaculties: false,
      hasCredits: false,
      positionEnabled: true, // Ranking enabled
      resultApprovalMode: ResultApprovalMode.OR,
      requireFinancialClearanceForResults: false,
      attendanceThresholdPercent: 75.0,
    },
  });

  // Secondary School Roles & Permissions
  for (const [code, perms] of Object.entries(DefaultRolePermissions)) {
    const role = await prisma.role.upsert({
      where: { institutionId_code: { institutionId: secondary.id, code } },
      update: {},
      data: {
        institutionId: secondary.id,
        code,
        name: code.replace(/_/g, ' '),
        isSystemRole: true,
      },
    });

    for (const p of perms) {
      const perm = await prisma.permission.upsert({
        where: { code: p },
        update: {},
        data: { code: p, module: p.split('.')[0] },
      });
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: role.id, permissionId: perm.id } },
        update: {},
        data: { roleId: role.id, permissionId: perm.id },
      });
    }
  }

  // Secondary School Grade Scale (A-F)
  let secScale = await prisma.gradeScale.findFirst({ where: { institutionId: secondary.id } });
  if (!secScale) {
    secScale = await prisma.gradeScale.create({
      data: {
        institutionId: secondary.id,
        name: 'National Secondary Standard (A-F)',
        boundaries: {
          create: [
            { grade: 'A', minMark: 75, maxMark: 100, gradePoints: 5.0, remarks: 'Distinction' },
            { grade: 'B', minMark: 65, maxMark: 74.99, gradePoints: 4.0, remarks: 'Merit' },
            { grade: 'C', minMark: 45, maxMark: 64.99, gradePoints: 3.0, remarks: 'Credit' },
            { grade: 'D', minMark: 30, maxMark: 44.99, gradePoints: 2.0, remarks: 'Pass' },
            { grade: 'F', minMark: 0, maxMark: 29.99, gradePoints: 1.0, remarks: 'Fail' },
          ],
        },
      },
    });
  }

  // Academic Year 2026
  const year2026 = await prisma.academicYear.upsert({
    where: { institutionId_name: { institutionId: secondary.id, name: '2026' } },
    update: {},
    data: {
      institutionId: secondary.id,
      name: '2026',
      startDate: new Date('2026-01-10'),
      endDate: new Date('2026-12-05'),
      isCurrent: true,
    },
  });

  // Terms
  const term1 = await prisma.academicTerm.upsert({
    where: { academicYearId_termNumber: { academicYearId: year2026.id, termNumber: 1 } },
    update: {},
    data: {
      academicYearId: year2026.id,
      name: 'Term 1',
      termNumber: 1,
      startDate: new Date('2026-01-10'),
      endDate: new Date('2026-06-15'),
      isCurrent: true,
    },
  });

  // Classes: Form 1 to Form 4
  const form1 = await prisma.programClass.upsert({
    where: { institutionId_code: { institutionId: secondary.id, code: 'F1' } },
    update: {},
    data: { institutionId: secondary.id, code: 'F1', name: 'Form 1', levelNumber: 1 },
  });

  const form2 = await prisma.programClass.upsert({
    where: { institutionId_code: { institutionId: secondary.id, code: 'F2' } },
    update: {},
    data: { institutionId: secondary.id, code: 'F2', name: 'Form 2', levelNumber: 2 },
  });

  // Streams
  await prisma.stream.upsert({
    where: { programClassId_name: { programClassId: form1.id, name: 'A' } },
    update: {},
    data: { programClassId: form1.id, name: 'A' },
  });

  // Subjects
  const physics = await prisma.subjectCourse.upsert({
    where: { institutionId_code: { institutionId: secondary.id, code: 'PHY' } },
    update: {},
    data: { institutionId: secondary.id, code: 'PHY', name: 'Physics', passMark: 40 },
  });

  const math = await prisma.subjectCourse.upsert({
    where: { institutionId_code: { institutionId: secondary.id, code: 'MATH' } },
    update: {},
    data: { institutionId: secondary.id, code: 'MATH', name: 'Basic Mathematics', passMark: 40 },
  });

  // Teacher Profile
  const teacherUser = await prisma.user.upsert({
    where: { email: 'teacher.physics@kilimanjarosec.edu' },
    update: {},
    data: {
      institutionId: secondary.id,
      email: 'teacher.physics@kilimanjarosec.edu',
      passwordHash,
      firstName: 'Baraka',
      lastName: 'Mrema',
    },
  });

  const teacherRole = await prisma.role.findFirst({
    where: { institutionId: secondary.id, code: 'TEACHER' },
  });
  if (teacherRole) {
    await prisma.userRole.upsert({
      where: { userId_roleId: { userId: teacherUser.id, roleId: teacherRole.id } },
      update: {},
      data: { userId: teacherUser.id, roleId: teacherRole.id },
    });
  }

  const staffTeacher = await prisma.staff.upsert({
    where: { institutionId_staffNumber: { institutionId: secondary.id, staffNumber: 'STF-001' } },
    update: {},
    data: {
      institutionId: secondary.id,
      userId: teacherUser.id,
      staffNumber: 'STF-001',
      designation: 'Physics Master',
    },
  });

  // Teacher Assignment: Baraka Mrema -> Form 1 Physics
  await prisma.teacherAssignment.upsert({
    where: {
      staffId_programClassId_streamId_subjectId_academicYearId: {
        staffId: staffTeacher.id,
        programClassId: form1.id,
        streamId: null,
        subjectId: physics.id,
        academicYearId: year2026.id,
      },
    },
    update: {},
    data: {
      staffId: staffTeacher.id,
      programClassId: form1.id,
      streamId: null,
      subjectId: physics.id,
      academicYearId: year2026.id,
    },
  });

  // Headmaster Account
  const headmasterUser = await prisma.user.upsert({
    where: { email: 'headmaster@kilimanjarosec.edu' },
    update: {},
    data: {
      institutionId: secondary.id,
      email: 'headmaster@kilimanjarosec.edu',
      passwordHash,
      firstName: 'Amina',
      lastName: 'Mollel',
    },
  });

  const headmasterRole = await prisma.role.findFirst({
    where: { institutionId: secondary.id, code: 'HEADMASTER_PRINCIPAL' },
  });
  if (headmasterRole) {
    await prisma.userRole.upsert({
      where: { userId_roleId: { userId: headmasterUser.id, roleId: headmasterRole.id } },
      update: {},
      data: { userId: headmasterUser.id, roleId: headmasterRole.id },
    });
  }

  await prisma.staff.upsert({
    where: { institutionId_staffNumber: { institutionId: secondary.id, staffNumber: 'STF-HEAD' } },
    update: {},
    data: {
      institutionId: secondary.id,
      userId: headmasterUser.id,
      staffNumber: 'STF-HEAD',
      designation: 'Headmistress',
    },
  });

  // Students in Form 1
  const studentData = [
    { num: 'STU-2026-0001', adm: 'ADM-26-01', first: 'Kelvin', last: 'Shirima' },
    { num: 'STU-2026-0002', adm: 'ADM-26-02', first: 'Neema', last: 'Massawe' },
    { num: 'STU-2026-0003', adm: 'ADM-26-03', first: 'Juma', last: 'Bakari' },
    { num: 'STU-2026-0004', adm: 'ADM-26-04', first: 'Fatma', last: 'Hassan' },
  ];

  for (const s of studentData) {
    const studentUser = await prisma.user.upsert({
      where: { email: `${s.num.toLowerCase()}@kilimanjarosec.edu` },
      update: {},
      data: {
        institutionId: secondary.id,
        email: `${s.num.toLowerCase()}@kilimanjarosec.edu`,
        passwordHash,
        firstName: s.first,
        lastName: s.last,
      },
    });

    const studentRole = await prisma.role.findFirst({
      where: { institutionId: secondary.id, code: 'STUDENT' },
    });
    if (studentRole) {
      await prisma.userRole.upsert({
        where: { userId_roleId: { userId: studentUser.id, roleId: studentRole.id } },
        update: {},
        data: { userId: studentUser.id, roleId: studentRole.id },
      });
    }

    const student = await prisma.student.upsert({
      where: { institutionId_studentNumber: { institutionId: secondary.id, studentNumber: s.num } },
      update: {},
      data: {
        institutionId: secondary.id,
        userId: studentUser.id,
        studentNumber: s.num,
        admissionNumber: s.adm,
        firstName: s.first,
        lastName: s.last,
        status: StudentStatus.ACTIVE,
      },
    });

    await prisma.studentEnrollment.upsert({
      where: { studentId_academicYearId: { studentId: student.id, academicYearId: year2026.id } },
      update: {},
      data: {
        studentId: student.id,
        academicYearId: year2026.id,
        programClassId: form1.id,
        isActive: true,
      },
    });
  }

  // 3. DEMO COLLEGE (University / College Model with Financial Clearance)
  console.log('Seeding Demo College...');
  const college = await prisma.institution.upsert({
    where: { code: 'TZ-COL-VICTORIA' },
    update: {},
    data: {
      code: 'TZ-COL-VICTORIA',
      name: 'Lake Victoria Institute of Technology',
      type: InstitutionType.COLLEGE,
      country: 'TZ',
      region: 'Mwanza',
      district: 'Nyamagana',
      contactEmail: 'registrar@lvit.ac.tz',
    },
  });

  await prisma.institutionSetting.upsert({
    where: { institutionId: college.id },
    update: {},
    data: {
      institutionId: college.id,
      cycleType: AcademicCycleType.SEMESTERS,
      cyclesPerYear: 2,
      hasStreams: false,
      hasFaculties: true,
      hasCredits: true,
      positionEnabled: false, // Colleges use GPA/Credits, not ranking
      resultApprovalMode: ResultApprovalMode.AND, // Higher ed multi-tier approval
      requireFinancialClearanceForResults: true, // Requires financial clearance before release
      attendanceThresholdPercent: 80.0,
    },
  });

  console.log('--- Database Seeding Completed Successfully! ---');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
