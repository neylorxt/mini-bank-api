import prisma from '../Config/Prisma.js'

export const getMyData = async (req, res) => {
    const {id} = req.user;

    if (isNaN(id)) return res.status(400).json({error: "ID invalide"});


    try {
        const user = await prisma.user.findFirst({
            where: {
                id
            },
            include: {
                sentTransfers: true,
                receivedTransfers: true,
                fundsReceiveLogs: true,
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

        res.status(200).json({message: "User delete successfully."})

    } catch (err) {
        console.log(err)
        res.status(400).json({message: "Error while getting user."})
    }
}



export const transfer = async (req, res) => {
    const {id} = req.user;

    if(isNaN(id)) return res.status(400).json({error: "ID invalide"});
    if(!req.body) return res.status(400).json({error: "Donnees manquantes"});
    if(!req.body.amount) return res.status(400).json({error: "Montant manquant"});
    if(isNaN(req.body.amount) || req.body.amount < 1) return res.status(400).json({error: "Montant invalide"});

    const {username, amount, message} = req.body;

    console.log(username, amount, message)

    try {
        // Vérifier si l'utilisateur existe
        const user = await prisma.user.findFirst({
            where: {
                id
            }
        })

        if (!user) return res.status(400).json({error: "User not found"});

        // Vérifier si le destinataire existe
        const receiver = await prisma.user.findFirst({
            where: {
                username
            }
        })

        if (!receiver) return res.status(400).json({error: "User avec l username : " + username + " not found"});

        // Vérifier si l'utilisateur n'essaie pas de s'envoyer de l'argent à lui-même
        if (user.id === receiver.id) {
            return res.status(400).json({error: "Vous ne pouvez pas vous envoyer de l'argent à vous-même"});
        }

        // Vérifier les fonds disponibles
        if( user.money < amount ) return res.status(400).json({error: "Vous n'avez pas assez de fonds."});

        // Exécuter la transaction
        await prisma.$transaction(async (tx) => {
            // Décrémenter l'argent de l'expéditeur
            await tx.user.update({
                where: {
                    id
                },
                data: {
                    money: {
                        decrement: amount
                    }
                }
            });

            // Incrémenter l'argent du destinataire
            await tx.user.update({
                where: {
                    id: receiver.id
                },
                data: {
                    money: {
                        increment: amount
                    }
                }
            });

            // Créer l'enregistrement du transfert
            await tx.recentFundsTransfer.create({
                data: {
                    amount,
                    senderId: id,
                    receiverId: receiver.id,
                    message: message ? message : "Aucun message",
                }
            });
        });

        // Récupérer les données utilisateur mises à jour
        const userFound = await prisma.user.findFirst({
            where: {
                id
            },
            include: {
                sentTransfers: true,
                receivedTransfers: true,
                fundsReceiveLogs: true,
            }
        })

        if (!userFound) {
            return res.status(500).json({ error: "User could not be retrieved after transfer." });
        }

        const {password, ...newUser} = userFound;

        res.status(200).json({
            user: newUser,
            message: "Transfer successfully."
        })

    } catch (err) {
        console.error("Erreur détaillée:", err);

        // Gestion d'erreurs plus spécifique
        if (err.code === 'P2002') {
            return res.status(400).json({error: "Erreur de contrainte de base de données"});
        }

        if (err.code === 'P2025') {
            return res.status(400).json({error: "Enregistrement non trouvé"});
        }

        if (err.message.includes('Insufficient funds')) {
            return res.status(400).json({error: "Fonds insuffisants"});
        }

        // Erreur générale mais plus informative
        res.status(500).json({
            error: "Erreur lors du transfert",
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
}