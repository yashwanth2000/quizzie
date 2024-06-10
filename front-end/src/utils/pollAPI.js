const backendUrl = import.meta.env.VITE_SERVER_URL;
const createPoll = async (pollData) => {
  try {
    const res = await fetch(`${backendUrl}/poll/create-poll`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pollData),
      credentials: "include",
    });

    const data = await res.json();
    if (data.success === false) {
      throw new Error(data.message);
    }

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getAllPolls = async () => {
  try {
    const res = await fetch(`${backendUrl}/poll/get-all`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const data = await res.json();

    if (data.success === false) {
      throw new Error(data.message);
    }

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getPollById = async (pollId) => {
  try {
    const res = await fetch(`${backendUrl}/poll/get/${pollId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const data = await res.json();

    if (data.success === false) {
      throw new Error(data.message);
    }

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getPollByCode = async (pollCode) => {
  try {
    const res = await fetch(`${backendUrl}/poll/code/${pollCode}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const data = await res.json();

    if (data.success === false) {
      throw new Error(data.message);
    }

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const updatePollAnalytics = async (pollCode, analytics) => {
  try {
    const res = await fetch(`${backendUrl}/poll/analytics/${pollCode}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(analytics),
    });

    const data = await res.json();

    if (data.success === false) {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};


const deletePoll = async (pollId) => {
  try {
    const res = await fetch(`${backendUrl}/poll/delete/${pollId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const data = await res.json();

    if (data.success === false) {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const updatePoll = async (pollId, pollData) => {
  try {
    const res = await fetch(`${backendUrl}/poll/update/${pollId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pollData),
      credentials: "include",
    });

    const data = await res.json();

    if (data.success === false) {
      throw new Error(data.message);
    }

    return data.poll;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export {
  createPoll,
  getAllPolls,
  deletePoll,
  getPollByCode,
  updatePollAnalytics,
  getPollById,
  updatePoll,
};
