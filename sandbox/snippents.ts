// const allUsers = await this.prisma.employees.findMany()
//         for await (let user of allUsers) {
//             // console.log(user)
//             const hb = user.hourly == 'T'
//             const gs = user.getting_salary == 'T'
//             const oe = user.officially_employed == 'T'
//             console.log(hb, user.hourly, 'hourly fix')
//             console.log(gs, user.getting_salary, 'getting salary')
//             console.log(oe, user.officially_employed, 'officialy employed')
//             // const updatedHourly = await this.prisma.employees.update({
//             //     where: {
//             //         id: user.id,
//             //     },
//             //     data: {
//             //         hourly_bool: hb,
//             //     },
//             // })
//         }
//         return allUsers

// const incorrectRecords = await this.prisma.$queryRaw<{ id: number }[]>`
//             SELECT id FROM Employees WHERE agreement_end = '0000-00-00'
//         `
//         for (let record of incorrectRecords) {
//             // console.log(record.id)
//             const fixedDate = await this.prisma.employees.update({
//                 where: {
//                     id: record.id,
//                 },
//                 data: {
//                     agreement_end_correct: null,
//                 },
//             })
//             console.log(fixedDate, '\n')
//         }
//         return incorrectRecords
