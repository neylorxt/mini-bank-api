import prisma from '../Config/Prisma.js'

export const getMyData = async (req, res) => {
    const {id} = req.user;

    if (isNaN(id)) return res.status(400).json({error: "ID invalide"});

    console.log(id)

    try {
        const user = await prisma.user.findFirst({
            where: {
                id
            },
            include: {
                recentFundsTransfer: true,
                recentFundsReceive: true
            }
        })

        const {password, ...newUser} = user;

        res.status(200).json({user: newUser})

    } catch (err) {
        console.log(err)
        res.status(400).json({message: "Error while getting user."})
    }
}


export const deleteMyData = async (req, res) => {
    const {id} = req.user;

    if (isNaN(id)) return res.status(400).json({error: "ID invalide"});

    console.log(id)

    try {
        const user = await prisma.user.findFirst({
            where: {
                id
            }
        })

        if (!user) return res.status(400).json({error: "User not found"});

        const userDelete = await prisma.user.delete({
            where: {
                id
            }
        })

        console.log(userDelete)

        res.status(200).json({message: "User delete successfully."})

    } catch (err) {
        console.log(err)
        res.status(400).json({message: "Error while getting user."})
    }
}