const backendUrl = import.meta.env.VITE_SERVER_URL;
console.log(backendUrl);
const createQuiz = async (quizData) => {
  try {
    const res = await fetch(`${backendUrl}/quiz/create-quiz`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(quizData),
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

const getAllQuizzes = async () => {
  try {
    const res = await fetch(`${backendUrl}/quiz/get-all`, {
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

const getQuizById = async (quizId) => {
  try {
    const res = await fetch(`${backendUrl}/quiz/get/${quizId}`, {
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

const getQuizByCode = async (quizCode) => {
  try {
    const res = await fetch(`${backendUrl}/quiz/code/${quizCode}`, {
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

const updateQuizAnalytics = async (quizCode, analytics) => {
  try {
    const res = await fetch(`${backendUrl}/quiz/analytics/${quizCode}`, {
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

const deleteQuiz = async (quizId) => {
  try {
    const res = await fetch(`${backendUrl}/quiz/delete/${quizId}`, {
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

const updateQuiz = async (quizId, quizData) => {
  try {
    const res = await fetch(`${backendUrl}/quiz/update/${quizId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(quizData),
      credentials: "include",
    });

    const data = await res.json();

    if (data.success === false) {
      throw new Error(data.message);
    }

    return data.quiz;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export {
  createQuiz,
  getAllQuizzes,
  deleteQuiz,
  getQuizByCode,
  updateQuizAnalytics,
  getQuizById,
  updateQuiz,
};
