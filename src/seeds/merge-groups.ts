// import mongoose from 'mongoose';
// import { faker } from '@faker-js/faker';
// import { User, UserSchema } from 'src/user/user.schema';
// import { Group, GroupSchema } from 'src/groups/groups.schema';

// // Define the Mongoose models based on your schema
// const userModel = mongoose.model<User>('User', UserSchema);
// const groupModel = mongoose.model<Group>('Group', GroupSchema);

// async function mergeStudentsToGroups() {
//   // Fetch all professors and students from the database
//   const professors = await userModel.find({ role: 'professor' });
//   const students = await userModel.find({ role: 'student' });

//   // console.log('👤 Merging students into groups...');

//   // Loop through each professor and assign students to groups
//   for (const professor of professors) {
//     // Find students who do not belong to any group yet
//     const availableStudents = students.filter(
//       (student) => student.groups.length === 0,
//     );

//     if (availableStudents.length > 0) {
//       // Randomly select a subset of students for the group
//       const studentsForGroup = faker.helpers.arrayElements(availableStudents, {
//         min: 5, // Minimum of 5 students per group
//         max: 10, // Maximum of 10 students per group
//       });

//       // Create a new group for the professor and assign students
//       const group = await groupModel.create({
//         name: `Group of ${professor.name}`,
//         professor: professor._id,
//         students: studentsForGroup.map((student) => student._id),
//         games: [], // You can add games later if needed
//       });

//       // Update each student's 'groups' field to include the new group
//       await Promise.all(
//         studentsForGroup.map((student) =>
//           userModel.updateOne(
//             { _id: student._id },
//             { $push: { groups: group._id } }, // Add the group to the student's groups array
//           ),
//         ),
//       );

//       console.log(
//         `Assigned ${studentsForGroup.length} students to ${professor.name}'s group.`,
//       );
//     }
//   }

//   console.log('✅ Merging complete!');
// }

// // Execute the function
// mergeStudentsToGroups().catch((err) => {
//   console.error('❌ Error merging students to groups:', err);
// });
