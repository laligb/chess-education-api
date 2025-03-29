import 'dotenv/config';
import { faker } from '@faker-js/faker';
import mongoose, { HydratedDocument } from 'mongoose';
import { User, UserSchema } from 'src/user/user.schema';
import { Tournament, TournamentSchema } from 'src/tournament/tournament.schema';
import { Game, GameSchema } from 'src/game/game.schema';
import { Group, GroupSchema } from 'src/groups/groups.schema';
import { realPgnGames } from './games';
import { AuthService } from 'src/user/auth.service';

/**
 * Instruction: To seed from terminal use this command:
 * chess-education-api git:(main) ✗ npx ts-node -r tsconfig-paths/register src/seeds/seed.ts
 **/

const DB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/nestjs-test';

async function seedDatabase() {
  const authService = new AuthService();

  console.log('📡 Connecting to database...');
  await mongoose.connect(DB_URI);

  const userModel = mongoose.model<User>('User', UserSchema);
  const tournamentModel = mongoose.model<Tournament>(
    'Tournament',
    TournamentSchema,
  );
  const gameModel = mongoose.model<Game>('Game', GameSchema);
  const groupModel = mongoose.model<Group>('Group', GroupSchema);

  console.log('🗑️ Clearing existing database...');
  await Promise.all([
    userModel.deleteMany({}),
    tournamentModel.deleteMany({}),
    gameModel.deleteMany({}),
    groupModel.deleteMany({}),
  ]);

  const users1 = await userModel.find({});

  for (const user of users1) {
    try {
      await authService.deleteFirebaseUser(user._id.toString()); // Using _id as UID
    } catch (error) {
      console.error(
        `❌ Failed to delete Firebase user for ${user.email}:`,
        error,
      );
    }
  }

  console.log('👤 Creating users...');
  const users: HydratedDocument<User>[] = [];
  const professors: HydratedDocument<User>[] = [];
  const students: HydratedDocument<User>[] = [];

  for (let i = 0; i < 100; i++) {
    const role = i < 20 ? 'professor' : i < 50 ? 'student' : 'user';
    const email = faker.internet.email().toLowerCase();
    const password = faker.internet.password();

    const firebaseUser = await authService.createFirebaseUser(email, password);
    if (firebaseUser) {
      const user = await userModel.create({
        name: faker.person.fullName(),
        email: email,
        password: password,
        role,
        groups: [],
        tournaments: [],
        games: [],
        photoUrl: faker.image.avatar(),
      });

      users.push(user);
      if (role === 'professor') professors.push(user);
      else if (role === 'student') students.push(user);
    }

    if (i % 10 === 0) {
      console.log(`Created ${i + 1} users...`);
    }
  }

  console.log('🏆 Creating tournaments...');
  const tournaments = await Promise.all(
    Array.from({ length: 30 }, async () => {
      const participants = faker.helpers.arrayElements(users, {
        min: 4,
        max: 10,
      });
      return tournamentModel.create({
        title: faker.helpers.arrayElement([
          'International Open Chess Tournament',
          'Grandmaster Challenge 2025',
          'Summer Chess Championship',
          'World Chess Masters',
          'Annual Rapid Chess Open',
          'The Classic Chess Invitational',
          'The Global Blitz Championship',
          'Online Chess Festival 2025',
          'The Elite Chess Tournament',
          'Chess for Peace Invitational',
          'European Chess Championship',
          'North American Open Chess',
          'Chess Pro League',
          'Speed Chess Championship',
          'Winter Chess Masters',
          'Student Chess Championship 2025',
        ]),
        date: faker.date.future(),
        location: {
          name: faker.location.city(),
          latitude: faker.location.latitude(),
          longitude: faker.location.longitude(),
        },
        players: participants.map((p) => p._id.toString()),
        games: [],
      });
    }),
  );

  console.log('♟️ Creating games...');
  await Promise.all(
    Array.from({ length: 20 }, async () => {
      const user = faker.helpers.arrayElement(users);
      const opponent = faker.helpers.arrayElement(
        users.filter((u) => u._id.toString() !== user._id.toString()),
      );
      const tournament = faker.helpers.arrayElement(tournaments);

      const tournamentId =
        tournament._id instanceof mongoose.Types.ObjectId
          ? tournament._id.toString()
          : tournament._id;

      const status = faker.helpers.arrayElement(['onGoing', 'completed']);
      const result =
        status === 'completed'
          ? faker.helpers.arrayElement(['1-0', '0-1', '1/2-1/2'])
          : '*';

      const whitePlayer = user.name || 'Player1';
      const blackPlayer = opponent.name || 'Player2';

      const pgnWithNames = faker.helpers
        .arrayElement(realPgnGames)
        .replace('{WHITE_PLAYER}', whitePlayer)
        .replace('{BLACK_PLAYER}', blackPlayer)
        .replace('{RESULT}', result);

      return gameModel.create({
        pgn: pgnWithNames,
        playerOne: user._id.toString(),
        playerTwo: opponent._id.toString(),
        status,
        result,
        tournamentId,
      });
    }),
  );

  console.log('✅ Seeding complete! Closing connection.');
  await mongoose.connection.close();
}

async function createGroupsAndAssignStudents() {
  console.log('📡 Connecting to database...');
  await mongoose.connect(DB_URI);

  const userModel = mongoose.model<User>('User', UserSchema);
  const groupModel = mongoose.model<Group>('Group', GroupSchema);

  console.log('🗑️ Deleting all existing groups...');
  await groupModel.deleteMany({});

  console.log("🗑️ Clearing students' group associations...");
  await userModel.updateMany({ role: 'student' }, { $set: { groups: [] } });

  const professors = await userModel.find({ role: 'professor' });
  const students = await userModel.find({ role: 'student' });

  console.log('👤 Creating new groups...');

  for (const professor of professors) {
    console.log(
      `Professor: ${professor.name}, Total Students: ${students.length}`,
    );

    const availableStudents = students.filter(
      (student) => student.groups.length === 0,
    );

    console.log(
      `Professor: ${professor.name}, Available Students: ${availableStudents.length}`,
    );

    if (availableStudents.length > 0) {
      const studentsForGroup = faker.helpers.arrayElements(availableStudents, {
        min: 5,
        max: 10,
      });

      console.log(
        `Assigning ${studentsForGroup.length} students to ${professor.name}`,
      );

      if (studentsForGroup.length === 0) {
        console.log(`No students found for ${professor.name}'s group.`);
        continue;
      }

      const group = await groupModel.create({
        name: `Group of ${professor.name}`,
        professor: professor._id,
        students: studentsForGroup.map((student) => student._id),
        games: [],
      });

      const professorUpdateResult = await userModel.updateOne(
        { _id: professor._id },
        { $push: { groups: group._id } },
      );

      console.log(
        `Professor ${professor.name} updated with new group:`,
        professorUpdateResult,
      );

      const studentUpdatePromises = studentsForGroup.map((student) =>
        userModel.updateOne(
          { _id: student._id },
          { $push: { groups: group._id } },
        ),
      );

      const studentUpdateResults = await Promise.all(studentUpdatePromises);

      console.log(
        `Successfully assigned group to students:`,
        studentUpdateResults,
      );

      console.log(
        `✅ Assigned ${studentsForGroup.length} students to ${professor.name}'s group.`,
      );
    }
  }

  console.log('✅ Group creation complete! Closing connection.');
  await mongoose.connection.close();
}

// seedDatabase().catch((err) => {
//   console.error('❌ Seeding failed:', err);
// });

// createGroupsAndAssignStudents().catch((err) => {
//   console.error('❌ Error creating groups:', err);
// });

async function runSeedAndGroups() {
  await seedDatabase();
  await createGroupsAndAssignStudents();
}

runSeedAndGroups().catch((err) => {
  console.error('❌ Seeding failed:', err);
});
