import {
  PrismaClient,
  Role,
  Gender,
  UserStatus,
  MembershipStatus,
  Specialty,
  Difficulty,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Xóa dữ liệu hiện có (nếu cần)
  await clearDatabase();

  // 1. Tạo users với các vai trò khác nhau
  const adminPassword = await bcrypt.hash('123456789', 10);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@gym.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: Role.ADMIN,
      phone: '0987654321',
      address: '123 Admin Street',
      city: 'Admin City',
      dateOfBirth: new Date('1990-01-01'),
      gender: Gender.MALE,
      isVerified: true,
      status: UserStatus.ACTIVE,
    },
  });

  const trainerPassword = await bcrypt.hash('123456789', 10);
  const trainer1 = await prisma.user.create({
    data: {
      email: 'trainer1@gym.com',
      password: trainerPassword,
      firstName: 'John',
      lastName: 'Trainer',
      role: Role.TRAINER,
      phone: '0987654322',
      address: '123 Trainer Street',
      city: 'Gym City',
      dateOfBirth: new Date('1985-05-15'),
      gender: Gender.MALE,
      isVerified: true,
      status: UserStatus.ACTIVE,
    },
  });

  const trainer2 = await prisma.user.create({
    data: {
      email: 'trainer2@gym.com',
      password: trainerPassword,
      firstName: 'Sarah',
      lastName: 'Coach',
      role: Role.TRAINER,
      phone: '0987654323',
      address: '456 Trainer Avenue',
      city: 'Fitness City',
      dateOfBirth: new Date('1988-08-20'),
      gender: Gender.FEMALE,
      isVerified: true,
      status: UserStatus.ACTIVE,
    },
  });

  const memberPassword = await bcrypt.hash('123456789', 10);
  const member1 = await prisma.user.create({
    data: {
      email: 'member1@example.com',
      password: memberPassword,
      firstName: 'David',
      lastName: 'Member',
      role: Role.MEMBER,
      phone: '0987654324',
      address: '789 Member Street',
      city: 'Member City',
      dateOfBirth: new Date('1992-03-25'),
      gender: Gender.MALE,
      isVerified: true,
      status: UserStatus.ACTIVE,
    },
  });

  const member2 = await prisma.user.create({
    data: {
      email: 'member2@example.com',
      password: memberPassword,
      firstName: 'Emily',
      lastName: 'User',
      role: Role.MEMBER,
      phone: '0987654325',
      address: '101 Member Avenue',
      city: 'Fitness City',
      dateOfBirth: new Date('1995-07-14'),
      gender: Gender.FEMALE,
      isVerified: true,
      status: UserStatus.ACTIVE,
    },
  });

  const receptionistPassword = await bcrypt.hash('Reception@123', 10);
  const receptionist = await prisma.user.create({
    data: {
      email: 'reception@gym.com',
      password: receptionistPassword,
      firstName: 'Reception',
      lastName: 'Staff',
      role: Role.RECEPTIONIST,
      phone: '0987654326',
      address: '202 Gym Front Desk',
      city: 'Gym City',
      dateOfBirth: new Date('1993-12-10'),
      gender: Gender.FEMALE,
      isVerified: true,
      status: UserStatus.ACTIVE,
    },
  });

  console.log('Created users');

  // 2. Tạo MembershipPlans
  const basicPlan = await prisma.membershipPlan.create({
    data: {
      name: 'Basic Plan',
      description: 'Access to gym facilities during standard hours.',
      price: 500000,
      durationMonths: 1,
      freePTSessions: 1,
      features: ['Gym access', '1 PT session', 'Locker access'],
      isActive: true,
    },
  });

  const standardPlan = await prisma.membershipPlan.create({
    data: {
      name: 'Standard Plan',
      description:
        'Full access to gym and group classes with limited PT sessions.',
      price: 1000000,
      durationMonths: 3,
      freePTSessions: 3,
      features: [
        '24/7 Gym access',
        '3 PT sessions',
        'Group classes',
        'Locker access',
      ],
      isActive: true,
    },
  });

  const premiumPlan = await prisma.membershipPlan.create({
    data: {
      name: 'Premium Plan',
      description:
        'VIP access to all facilities and services with unlimited PT sessions.',
      price: 2000000,
      durationMonths: 6,
      freePTSessions: 12,
      features: [
        '24/7 Gym access',
        '12 PT sessions',
        'All classes',
        'Nutrition plan',
        'Sauna & spa',
        'Premium locker',
      ],
      isActive: true,
    },
  });

  console.log('Created membership plans');

  // 3. Tạo Member profiles
  const memberProfile1 = await prisma.member.create({
    data: {
      userId: member1.id,
      emergencyContact: 'Jane Member',
      emergencyPhone: '0987654327',
      healthNotes: 'No health issues',
      memberSince: new Date('2023-01-15'),
      expiryDate: new Date('2023-07-15'),
      membershipStatus: MembershipStatus.ACTIVE,
      remainingPT: 5,
      membershipPlanId: standardPlan.id,
    },
  });

  const memberProfile2 = await prisma.member.create({
    data: {
      userId: member2.id,
      emergencyContact: 'Michael User',
      emergencyPhone: '0987654328',
      healthNotes: 'Mild asthma',
      memberSince: new Date('2023-02-20'),
      expiryDate: new Date('2023-08-20'),
      membershipStatus: MembershipStatus.ACTIVE,
      remainingPT: 10,
      membershipPlanId: premiumPlan.id,
    },
  });

  console.log('Created member profiles');

  // 4. Tạo Trainer profiles
  const trainerProfile1 = await prisma.trainer.create({
    data: {
      userId: trainer1.id,
      title: 'Senior Fitness Trainer',
      bio: 'Experienced trainer specializing in strength and conditioning. Helps clients achieve their fitness goals with personalized training programs.',
      experience: 8,
      rating: 4.8,
      reviewCount: 120,
      specialties: {
        create: [
          { specialty: Specialty.STRENGTH },
          { specialty: Specialty.HIIT },
          { specialty: Specialty.CARDIO },
        ],
      },
      certifications: {
        create: [
          {
            name: 'NASM Certified Personal Trainer',
            issueDate: new Date('2015-05-15'),
            expiryDate: new Date('2024-05-15'),
            issuedBy: 'National Academy of Sports Medicine',
          },
          {
            name: 'CrossFit Level 2 Trainer',
            issueDate: new Date('2017-07-20'),
            expiryDate: new Date('2023-07-20'),
            issuedBy: 'CrossFit',
          },
        ],
      },
      schedules: {
        create: [
          {
            dayOfWeek: 'MONDAY',
            startTime: '08:00',
            endTime: '16:00',
            isAvailable: true,
          },
          {
            dayOfWeek: 'WEDNESDAY',
            startTime: '08:00',
            endTime: '16:00',
            isAvailable: true,
          },
          {
            dayOfWeek: 'FRIDAY',
            startTime: '08:00',
            endTime: '16:00',
            isAvailable: true,
          },
        ],
      },
    },
  });

  const trainerProfile2 = await prisma.trainer.create({
    data: {
      userId: trainer2.id,
      title: 'Yoga & Pilates Instructor',
      bio: 'Certified yoga and pilates instructor with experience in rehabilitation and flexibility training.',
      experience: 6,
      rating: 4.9,
      reviewCount: 95,
      specialties: {
        create: [
          { specialty: Specialty.YOGA },
          { specialty: Specialty.PILATES },
          { specialty: Specialty.REHABILITATION },
        ],
      },
      certifications: {
        create: [
          {
            name: 'RYT-200 Yoga Teacher',
            issueDate: new Date('2017-03-10'),
            expiryDate: null,
            issuedBy: 'Yoga Alliance',
          },
          {
            name: 'Comprehensive Pilates Certification',
            issueDate: new Date('2018-06-15'),
            expiryDate: null,
            issuedBy: 'Body Arts and Science International',
          },
        ],
      },
      schedules: {
        create: [
          {
            dayOfWeek: 'TUESDAY',
            startTime: '09:00',
            endTime: '17:00',
            isAvailable: true,
          },
          {
            dayOfWeek: 'THURSDAY',
            startTime: '09:00',
            endTime: '17:00',
            isAvailable: true,
          },
          {
            dayOfWeek: 'SATURDAY',
            startTime: '10:00',
            endTime: '14:00',
            isAvailable: true,
          },
        ],
      },
    },
  });

  console.log('Created trainer profiles');

  // 5. Tạo Classes
  const strengthClass = await prisma.class.create({
    data: {
      title: 'Advanced Strength Training',
      description:
        'A high-intensity class focused on building strength and muscle. Suitable for intermediate to advanced levels.',
      category: Specialty.STRENGTH,
      difficulty: Difficulty.ADVANCED,
      maxParticipants: 12,
      image: '/class-strength.jpg',
      trainerId: trainerProfile1.id,
      schedules: {
        create: [
          {
            dayOfWeek: 'MONDAY',
            startTime: '18:00',
            endTime: '19:00',
            isActive: true,
          },
          {
            dayOfWeek: 'WEDNESDAY',
            startTime: '18:00',
            endTime: '19:00',
            isActive: true,
          },
        ],
      },
    },
  });

  const yogaClass = await prisma.class.create({
    data: {
      title: 'Morning Yoga Flow',
      description:
        'Start your day with an energizing yoga flow. This class focuses on flexibility, balance, and mental clarity.',
      category: Specialty.YOGA,
      difficulty: Difficulty.BEGINNER,
      maxParticipants: 20,
      image: '/class-yoga.jpg',
      trainerId: trainerProfile2.id,
      schedules: {
        create: [
          {
            dayOfWeek: 'TUESDAY',
            startTime: '07:00',
            endTime: '08:00',
            isActive: true,
          },
          {
            dayOfWeek: 'THURSDAY',
            startTime: '07:00',
            endTime: '08:00',
            isActive: true,
          },
        ],
      },
    },
  });

  const hiitClass = await prisma.class.create({
    data: {
      title: 'HIIT Blast',
      description:
        'High-Intensity Interval Training session designed to maximize calorie burn and improve cardiovascular fitness.',
      category: Specialty.HIIT,
      difficulty: Difficulty.INTERMEDIATE,
      maxParticipants: 15,
      image: '/class-hiit.jpg',
      trainerId: trainerProfile1.id,
      schedules: {
        create: [
          {
            dayOfWeek: 'FRIDAY',
            startTime: '17:30',
            endTime: '18:30',
            isActive: true,
          },
        ],
      },
    },
  });

  console.log('Created classes');

  // 6. Tạo Class Enrollments
  const enrollment1 = await prisma.classEnrollment.create({
    data: {
      classId: yogaClass.id,
      memberId: memberProfile1.id,
      enrolledAt: new Date('2023-03-01'),
      status: 'ACTIVE',
    },
  });

  const enrollment2 = await prisma.classEnrollment.create({
    data: {
      classId: hiitClass.id,
      memberId: memberProfile2.id,
      enrolledAt: new Date('2023-03-05'),
      status: 'ACTIVE',
    },
  });

  console.log('Created class enrollments');

  // 7. Tạo Appointments
  const appointment1 = await prisma.appointment.create({
    data: {
      memberId: memberProfile1.id,
      trainerId: trainerProfile1.id,
      date: new Date('2023-05-10'),
      startTime: '10:00',
      endTime: '11:00',
      status: 'SCHEDULED',
      notes: 'Focus on upper body strength training',
    },
  });

  const appointment2 = await prisma.appointment.create({
    data: {
      memberId: memberProfile2.id,
      trainerId: trainerProfile2.id,
      date: new Date('2023-05-11'),
      startTime: '14:00',
      endTime: '15:00',
      status: 'SCHEDULED',
      notes: 'Beginner yoga session with focus on flexibility',
    },
  });

  console.log('Created appointments');

  // 8. Tạo Trainer Reviews
  const review1 = await prisma.trainerReview.create({
    data: {
      trainerId: trainerProfile1.id,
      memberId: memberProfile1.id,
      rating: 5.0,
      comment:
        'John is an exceptional trainer! He helped me reach my strength goals with a customized program that challenged me at every session.',
    },
  });

  const review2 = await prisma.trainerReview.create({
    data: {
      trainerId: trainerProfile2.id,
      memberId: memberProfile2.id,
      rating: 4.8,
      comment:
        'Sarah is a knowledgeable yoga instructor. Her classes are the perfect balance of challenging and relaxing.',
    },
  });

  console.log('Created trainer reviews');

  // 9. Tạo Payments & Transactions
  const payment1 = await prisma.payment.create({
    data: {
      memberId: memberProfile1.id,
      membershipPlanId: standardPlan.id,
      amount: standardPlan.price,
      paymentMethod: 'CREDIT_CARD',
      status: 'COMPLETED',
      transactionId: 'txn_' + Math.random().toString(36).substring(2, 15),
      description: 'Standard Plan - 3 months',
      paidAt: new Date('2023-01-15'),
      Transaction: {
        create: {
          transactionCode:
            'TXN-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
          gateway: 'stripe',
          gatewayResponse: '{"status": "succeeded"}',
          gatewayTransactionId:
            'pi_' + Math.random().toString(36).substring(2, 15),
          amount: standardPlan.price,
          currency: 'VND',
          feeAmount: standardPlan.price * 0.029 + 2000,
          netAmount: standardPlan.price * 0.971 - 2000,
          status: 'COMPLETED',
        },
      },
    },
  });

  const payment2 = await prisma.payment.create({
    data: {
      memberId: memberProfile2.id,
      membershipPlanId: premiumPlan.id,
      amount: premiumPlan.price,
      paymentMethod: 'BANK_TRANSFER',
      status: 'COMPLETED',
      transactionId: 'txn_' + Math.random().toString(36).substring(2, 15),
      description: 'Premium Plan - 6 months',
      paidAt: new Date('2023-02-20'),
      Transaction: {
        create: {
          transactionCode:
            'TXN-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
          gateway: 'bank',
          gatewayResponse: '{"status": "approved"}',
          gatewayTransactionId:
            'bt_' + Math.random().toString(36).substring(2, 15),
          amount: premiumPlan.price,
          currency: 'VND',
          feeAmount: 0,
          netAmount: premiumPlan.price,
          status: 'COMPLETED',
        },
      },
    },
  });

  console.log('Created payments and transactions');

  // 10. Tạo Subscriptions
  const subscription1 = await prisma.subscription.create({
    data: {
      memberId: memberProfile1.id,
      membershipPlanId: standardPlan.id,
      startDate: new Date('2023-01-15'),
      endDate: new Date('2023-04-15'),
      status: 'ACTIVE',
      autoRenew: false,
    },
  });

  const subscription2 = await prisma.subscription.create({
    data: {
      memberId: memberProfile2.id,
      membershipPlanId: premiumPlan.id,
      startDate: new Date('2023-02-20'),
      endDate: new Date('2023-08-20'),
      status: 'ACTIVE',
      autoRenew: true,
    },
  });

  console.log('Created subscriptions');

  // 11. Tạo Body Measurements
  const measurement1 = await prisma.bodyMeasurement.create({
    data: {
      memberId: memberProfile1.id,
      weight: 78.5,
      height: 175,
      bodyFat: 18.5,
      muscleMass: 65.2,
      bmi: 25.6,
      notes: 'Initial measurement',
      measuredAt: new Date('2023-01-16'),
    },
  });

  const measurement2 = await prisma.bodyMeasurement.create({
    data: {
      memberId: memberProfile1.id,
      weight: 77.2,
      height: 175,
      bodyFat: 17.8,
      muscleMass: 65.8,
      bmi: 25.2,
      notes: 'After 1 month of training',
      measuredAt: new Date('2023-02-16'),
    },
  });

  console.log('Created body measurements');

  // 12. Tạo Notifications
  const notification1 = await prisma.notification.create({
    data: {
      userId: member1.id,
      sentById: admin.id,
      title: 'Welcome to Our Gym!',
      message:
        'Thank you for joining our gym. We are excited to have you as a member!',
      type: 'SYSTEM',
      isRead: true,
    },
  });

  const notification2 = await prisma.notification.create({
    data: {
      userId: member1.id,
      title: 'Appointment Reminder',
      message:
        'You have a training session tomorrow at 10:00 AM with John Trainer.',
      type: 'APPOINTMENT_REMINDER',
      isRead: false,
    },
  });

  console.log('Created notifications');

  // 13. Tạo Discount Codes
  const discount1 = await prisma.discountCode.create({
    data: {
      code: 'NEWYEAR2023',
      description: 'New Year Special Offer',
      discountType: 'PERCENTAGE',
      discountValue: 15, // 15% off
      minimumPurchase: 500000,
      maximumDiscount: 300000,
      startDate: new Date('2023-01-01'),
      endDate: new Date('2023-01-31'),
      usageLimit: 100,
      usedCount: 45,
      isActive: false, // Expired
      applicablePlans: {
        connect: [{ id: standardPlan.id }, { id: premiumPlan.id }],
      },
    },
  });

  const discount2 = await prisma.discountCode.create({
    data: {
      code: 'SUMMER2023',
      description: 'Summer Fitness Special',
      discountType: 'FIXED_AMOUNT',
      discountValue: 200000, // 200,000 VND off
      minimumPurchase: 1000000,
      startDate: new Date('2023-06-01'),
      endDate: new Date('2023-08-31'),
      usageLimit: 50,
      usedCount: 0,
      isActive: true,
      applicablePlans: {
        connect: [
          { id: standardPlan.id },
          { id: premiumPlan.id },
          { id: basicPlan.id },
        ],
      },
    },
  });

  console.log('Created discount codes');

  console.log('Seeding completed successfully!');
}

async function clearDatabase() {
  // Clear existing data (in reverse order of dependencies)
  await prisma.discountUsage.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.bodyMeasurement.deleteMany({});
  await prisma.transaction.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.checkIn.deleteMany({});
  await prisma.subscription.deleteMany({});
  await prisma.classEnrollment.deleteMany({});
  await prisma.classSchedule.deleteMany({});
  await prisma.class.deleteMany({});
  await prisma.trainerReview.deleteMany({});
  await prisma.appointment.deleteMany({});
  await prisma.schedule.deleteMany({});
  await prisma.certification.deleteMany({});
  await prisma.trainerSpecialty.deleteMany({});
  await prisma.trainerAvailability.deleteMany({});
  await prisma.trainer.deleteMany({});
  await prisma.member.deleteMany({});
  await prisma.discountCode.deleteMany({});
  await prisma.membershipPlan.deleteMany({});
  await prisma.refreshToken.deleteMany({});
  await prisma.device.deleteMany({});
  await prisma.file.deleteMany({});
  await prisma.auditLog.deleteMany({});
  await prisma.user.deleteMany({});
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
