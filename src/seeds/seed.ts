import 'dotenv/config';
import { faker } from '@faker-js/faker';
import mongoose, { HydratedDocument } from 'mongoose';
import { User, UserSchema } from 'src/user/user.schema';
import { Tournament, TournamentSchema } from 'src/tournament/tournament.schema';
import { Game, GameSchema } from 'src/game/game.schema';
import { Group, GroupSchema } from 'src/groups/groups.schema';
import { realPgnGames } from './games'; // Import the games from the file

/**
 * Instruction: To seed from terminal use this command:
 * chess-education-api git:(main) ✗ npx ts-node -r tsconfig-paths/register src/seeds/seed.ts
 **/

const DB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/nestjs-test';

async function seedDatabase() {
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

  console.log('👤 Creating users...');
  const users: HydratedDocument<User>[] = [];
  const professors: HydratedDocument<User>[] = [];
  const students: HydratedDocument<User>[] = [];

  for (let i = 0; i < 100; i++) {
    const role = i < 20 ? 'professor' : i < 50 ? 'student' : 'user';
    const user = await userModel.create({
      name: faker.person.fullName(),
      email: faker.internet.email().toLowerCase(),
      password: faker.internet.password(),
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

      // Explicitly type the tournament._id as mongoose.Types.ObjectId
      const tournamentId =
        tournament._id instanceof mongoose.Types.ObjectId
          ? tournament._id.toString()
          : tournament._id;

      const status = faker.helpers.arrayElement(['onGoing', 'completed']);
      const result =
        status === 'completed'
          ? faker.helpers.arrayElement(['1-0', '0-1', '1/2-1/2'])
          : '*';

      // Ensure both players have names
      const whitePlayer = user.name || 'Player1';
      const blackPlayer = opponent.name || 'Player2';

      // Replace placeholders with actual player names and result
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

seedDatabase().catch((err) => {
  console.error('❌ Seeding failed:', err);
});
