import VideoModel from "../models/VideoModel.js";

export const createVideo = async (req, res) => {
  const { videoUrl } = req.body;

  if (!videoUrl) {
    res.status(400);
    throw new Error("Video url fields are required");
  }

  try {
    const video = await VideoModel.create({
      videoUrl,
    });

    res.status(201).json({
      success: true,
      video,
    });
  } catch (error) {
    console.log(error);
    res.status(400);
    throw error;
  }
};
