function hotlistBody({
  curationNodeId = "xffde7c31",
  onlyOfficialProjectSpinoffs = false,
  sort = "HOT",
  cursor = "",
  itemsPerPage = 100
} = {}) {
  return {
    query: `query hotlist($curationNodeId: String, $onlyOfficialProjectSpinoffs: Boolean!, $sort: ListProgramSortOrder, $pageInfo: ListProgramsPageInfo) {
  listTopPrograms(
    curationNodeId: $curationNodeId
    onlyOfficialProjectSpinoffs: $onlyOfficialProjectSpinoffs
    sort: $sort
    pageInfo: $pageInfo
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
      __typename
    }
    __typename
  }
}`,
    variables: {
      curationNodeId,
      onlyOfficialProjectSpinoffs,
      sort,
      pageInfo: {
        itemsPerPage,
        cursor,
      }
    }
  }
}

function projectsAuthoredByUserBody({
  kaid,
  sort = "TOP",
  cursor = "",
  itemsPerPage = 10
} = {}) {
  return {
    query: `query projectsAuthoredByUser($kaid: String, $pageInfo: ListProgramsPageInfo, $sort: ListProgramSortOrder) {
  user(kaid: $kaid) {
    id
    programs(pageInfo: $pageInfo, sort: $sort) {
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
        __typename
      }
      __typename
    }
    __typename
  }
}`,
    variables: {
      kaid,
      sort,
      "pageInfo": {
        cursor,
        itemsPerPage
      }
    }
  }
}

function feedbackQueryBody({
  topicId,
  focusKind = "scratchpad",
  feedbackType = "COMMENT",
  currentSort = 1,
  limit = 1000
} = {}) {
  return {
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
      topicId,
      focusKind,
      feedbackType,
      currentSort,
      limit
    }
  }
}

function programQueryBody({
  programId,
} = {}) {
  return {
    query: `query programQuery($programId: String!) {
  programById(id: $programId) {
    byChild
    category
    created
    creatorProfile: author {
      id
      nickname
      profileRoot
      profile {
        accessLevel
        __typename
      }
      __typename
    }
    deleted
    description
    spinoffCount: displayableSpinoffCount
    docsUrlPath
    flags
    flaggedBy: flaggedByKaids
    flaggedByUser: isFlaggedByCurrentUser
    height
    hideFromHotlist
    id
    imagePath
    isProjectOrFork: originIsProject
    isOwner
    kaid: authorKaid
    key
    newUrlPath
    originScratchpad: originProgram {
      deleted
      translatedTitle
      url
      __typename
    }
    restrictPosting
    revision: latestRevision {
      id
      code
      configVersion
      created
      editorType
      folds
      __typename
    }
    slug
    sumVotesIncremented
    title
    topic: parentCurationNode {
      id
      nodeSlug: slug
      relativeUrl
      slug
      translatedTitle
      __typename
    }
    translatedTitle
    url
    userAuthoredContentType
    upVoted
    width
    __typename
  }
}`,
    variables: {
      programId
    }
  }
}

function avatarDataForProfileBody({
  kaid
} = {}) {
  return {
    query: `query avatarDataForProfile($kaid: String!) {
  user(kaid: $kaid) {
    id
    avatar {
      name
      imageSrc
      __typename
    }
    __typename
  }
}`,
    variables: {
      kaid
    }
  }
}


export {
  hotlistBody,
  projectsAuthoredByUserBody,
  feedbackQueryBody,
  programQueryBody,
  avatarDataForProfileBody
}
