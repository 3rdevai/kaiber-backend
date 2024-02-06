import ClientModel from "../models/ClientModel.js";

export const createClient = async (req, res) => {
  const { clientName, emailAddress } = req.body;
  console.log(req.body);

  if (!clientName || !emailAddress) {
    res.status(400);
    throw new Error("fields are required");
  }

  try {
    const client = await ClientModel.create({
      clientName,
      emailAddress,
    });

    res.status(201).json({
      success: true,
      client,
    });
    console.log(client);
  } catch (error) {
    console.log(error);
    res.status(400);
    throw error;
  }
};
