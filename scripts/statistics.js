import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'

dotenv.config({ path: '../.env' })

const client = new MongoClient(process.env.MONGODB_URI)

const now = Date.now()
const agg = [
  {
    $match: {
      timestamp: {
        $gt: now - 1000 * 60 * 60 * 24,
        $lt: now,
      },
    },
  },
  {
    $group: {
      _id: '$program_id',
      firstVotes: {
        $min: '$votes',
      },
      lastVotes: {
        $max: '$votes',
      },
      firstForks: {
        $min: '$forks',
      },
      lastForks: {
        $max: '$forks',
      },
      firstComments: {
        $min: '$comments',
      },
      lastComments: {
        $max: '$comments',
      },
      firstCommentVotes: {
        $min: '$commentVotes',
      },
      lastCommentVotes: {
        $max: '$commentVotes',
      },
      firstReplies: {
        $min: '$replies',
      },
      lastReplies: {
        $max: '$replies',
      },
    },
  },
  {
    $set: {
      changeVotes: {
        $subtract: ['$lastVotes', '$firstVotes'],
      },
      changeForks: {
        $subtract: ['$lastForks', '$firstForks'],
      },
      changeComments: {
        $subtract: ['$lastComments', '$firstComments'],
      },
      changeCommentVotes: {
        $subtract: ['$lastCommentVotes', '$firstCommentVotes'],
      },
      changeReplies: {
        $subtract: ['$lastReplies', '$firstReplies'],
      },
    },
  },
  {
    $group: {
      _id: {},
      sumVotes: {
        $sum: '$changeVotes',
      },
      sumForks: {
        $sum: '$changeForks',
      },
      sumComments: {
        $sum: '$changeComments',
      },
      sumCommentVotes: {
        $sum: '$changeCommentVotes',
      },
      sumReplies: {
        $sum: '$changeReplies',
      },
      countPrograms: {
        $sum: 1,
      },
    },
  },
]
const db = client.db()
const hotlist = db.collection('hotlist')
const cursor = hotlist.aggregate(agg)
const data = (await cursor.toArray())[0]
const document = {
  timestamp: now,
  votes: data.sumVotes,
  forks: data.sumForks,
  comments: data.sumComments,
  commentVotes: data.sumCommentVotes,
  replies: data.sumReplies,
  programs: data.countPrograms,
}
const statistics = db.collection('statistics')
await statistics.insertOne(document)

await client.close()

console.log('Sending heartbeat...')
await fetch(process.env.STATISTICS_HEARTBEAT_URL)
