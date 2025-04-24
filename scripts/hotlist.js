import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'

dotenv.config({ path: '../.env' })

const client = new MongoClient(process.env.MONGODB_URI)

const BATCH_SIZE = 10
const PROGRAMS = 100
const DELAY = 500

async function getHotlist() {
  const postData = {
    query: `query hotlist($curationNodeId: String, $onlyOfficialProjectSpinoffs: Boolean!, $sort: ListProgramSortOrder, $pageInfo: ListProgramsPageInfo, $userAuthoredContentTypes: [UserAuthoredContentType!]) {
  listTopPrograms(
    curationNodeId: $curationNodeId
    onlyOfficialProjectSpinoffs: $onlyOfficialProjectSpinoffs
    sort: $sort
    pageInfo: $pageInfo
    userAuthoredContentTypes: $userAuthoredContentTypes
  ) {
    complete
    cursor
    programs {
      id
      key
      authorKaid
      authorNickname
      displayableSpinoffCount
      imagePath
      sumVotesIncremented
      translatedTitle: title
      url
      userAuthoredContentType
      __typename
    }
    __typename
  }
}`,
    variables: {
      curationNodeId: 'xffde7c31',
      onlyOfficialProjectSpinoffs: false,
      sort: 'HOT',
      pageInfo: {
        itemsPerPage: PROGRAMS,
        cursor: '',
      },
    },
  }
  const res = await fetch(
    'https://www.khanacademy.org/api/internal/graphql/hotlist',
    {
      method: 'POST',
      body: JSON.stringify(postData),
    }
  )

  let text = await res.text()

  if (res.status === 403) {
    postData.query = await fetch(
      'https://cdn.jsdelivr.net/gh/bhavjitChauhan/khan-api@safelist/query/hotlist'
    ).then(res => res.text())
    const res = await fetch(
      'https://www.khanacademy.org/api/internal/graphql/hotlist',
      {
        method: 'POST',
        body: JSON.stringify(postData),
      }
    )
    text = await res.text()
  }

  const parsed = JSON.parse(text)

  return parsed.data.listTopPrograms.programs
}

async function getComments(id) {
  const postData = {
    query: `query feedbackQuery($topicId: String!, $focusKind: String!, $cursor: String, $limit: Int, $feedbackType: FeedbackType!, $currentSort: Int, $qaExpandKey: String) {
  feedback(
    focusId: $topicId
    cursor: $cursor
    limit: $limit
    feedbackType: $feedbackType
    focusKind: $focusKind
    sort: $currentSort
    qaExpandKey: $qaExpandKey
    answersLimit: 1
  ) {
    feedback {
      isLocked
      isPinned
      replyCount
      appearsAsDeleted
      author {
        id
        kaid
        nickname
        avatar {
          name
          imageSrc
          __typename
        }
        __typename
      }
      badges {
        name
        icons {
          smallUrl
          __typename
        }
        description
        __typename
      }
      content
      date
      definitelyNotSpam
      deleted
      downVoted
      expandKey
      feedbackType
      flaggedBy
      flaggedByUser
      flags
      focusUrl
      focus {
        kind
        id
        translatedTitle
        relativeUrl
        __typename
      }
      fromVideoAuthor
      key
      lowQualityScore
      notifyOnAnswer
      permalink
      qualityKind
      replyCount
      replyExpandKeys
      showLowQualityNotice
      sumVotesIncremented
      upVoted
      ... on QuestionFeedback {
        hasAnswered
        answers {
          isLocked
          isPinned
          replyCount
          appearsAsDeleted
          author {
            id
            kaid
            nickname
            avatar {
              name
              imageSrc
              __typename
            }
            __typename
          }
          badges {
            name
            icons {
              smallUrl
              __typename
            }
            description
            __typename
          }
          content
          date
          definitelyNotSpam
          deleted
          downVoted
          expandKey
          feedbackType
          flaggedBy
          flaggedByUser
          flags
          focusUrl
          focus {
            kind
            id
            translatedTitle
            relativeUrl
            __typename
          }
          fromVideoAuthor
          key
          lowQualityScore
          notifyOnAnswer
          permalink
          qualityKind
          replyCount
          replyExpandKeys
          showLowQualityNotice
          sumVotesIncremented
          upVoted
          __typename
        }
        isOld
        answerCount
        __typename
      }
      ... on AnswerFeedback {
        question {
          isLocked
          isPinned
          replyCount
          appearsAsDeleted
          author {
            id
            kaid
            nickname
            avatar {
              name
              imageSrc
              __typename
            }
            __typename
          }
          badges {
            name
            icons {
              smallUrl
              __typename
            }
            description
            __typename
          }
          content
          date
          definitelyNotSpam
          deleted
          downVoted
          expandKey
          feedbackType
          flaggedBy
          flaggedByUser
          flags
          focusUrl
          focus {
            kind
            id
            translatedTitle
            relativeUrl
            __typename
          }
          fromVideoAuthor
          key
          lowQualityScore
          notifyOnAnswer
          permalink
          qualityKind
          replyCount
          replyExpandKeys
          showLowQualityNotice
          sumVotesIncremented
          upVoted
          __typename
        }
        __typename
      }
      __typename
    }
    cursor
    isComplete
    sortedByDate
    __typename
  }
}`,
    variables: {
      topicId: id,
      focusKind: 'scratchpad',
      feedbackType: 'COMMENT',
      currentSort: 1,
      limit: 1000,
    },
  }

  const res = await fetch(
    'https://www.khanacademy.org/api/internal/graphql/feedbackQuery',
    {
      method: 'POST',
      body: JSON.stringify(postData),
    }
  )

  let text = await res.text()

  if (res.status === 403) {
    postData.query = await fetch(
      'https://cdn.jsdelivr.net/gh/bhavjitChauhan/khan-api@safelist/query/feedbackQuery'
    ).then(res => res.text())
    const res = await fetch(
      'https://www.khanacademy.org/api/internal/graphql/feedbackQuery',
      {
        method: 'POST',
        body: JSON.stringify(postData),
      }
    )
    text = await res.text()
  }

  const parsed = JSON.parse(text)

  return parsed.data?.feedback?.feedback
}

console.log('Fetching hotlist...')
const hotlist = await getHotlist()

const timestamp = Date.now()
const programs = hotlist.map((program, index) => ({
  program_id: program.id,
  timestamp: timestamp,
  rank: index + 1,
  votes: program.sumVotesIncremented,
  forks: program.displayableSpinoffCount,
}))

console.log('Fetching comments...')
for (let i = 0; i < programs.length; i += BATCH_SIZE) {
  console.log(
    `Fetching comments for ${i} to ${i + BATCH_SIZE} of ${programs.length}...`
  )
  await Promise.all(
    programs.slice(i, i + BATCH_SIZE).map(async (program, j) => {
      const comments = await getComments(program.program_id)
      if (!comments) return
      if (comments.every(comment => comment === null)) return
      const commentVotes = comments.reduce((acc, comment) => {
        if (!comment) return 0
        return acc + comment.sumVotesIncremented
      }, 0)
      const replies = comments.reduce((acc, comment) => {
        if (!comment) return 0
        return acc + comment.replyCount
      }, 0)
      programs[i + j] = {
        ...program,
        comments: comments.length,
        commentVotes,
        replies,
      }
    })
  )
  await new Promise(resolve => setTimeout(resolve, DELAY))
}

console.log('Inserting...')
const collection = client.db().collection('hotlist')
await collection.insertMany(programs)

await client.close()

console.log('Sending heartbeat...')
await fetch(process.env.HOTLIST_HEARTBEAT_URL)
