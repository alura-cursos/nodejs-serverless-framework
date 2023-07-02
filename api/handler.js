const { json } = require("express/lib/response");

const correctQuestions = [3, 1, 0, 2]
const previousResults = new Map()

function extractBody (event) {
  if(!event?.body) {
    return {
      statusCode: 422,
      body: JSON.stringify({error: "Missing Body"})
    }
  }
  return JSON.parse(event.body)
}

module.exports.sendResponse = async (event) => {
  const { name, answers } = extractBody(event);
  const correctAnswers = answers.reduce((acc, answer, index) => {
    if (answer === correctQuestions[index]) {
      acc++
    }
    return acc
  }, 0)

  const result = {
    name,
    correctAnswers,
    totalAnswers: answers.length
  }

  const resultId = randomUUID()
  previousResults.set(resultId, { response: req.body, result })

  return {
    statusCode: 201,
    body: JSON.stringify({
      resultId,
      __hypermedia: {
        href: `/results.html`,
        query: { id: resultId }
      }
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  }
};
