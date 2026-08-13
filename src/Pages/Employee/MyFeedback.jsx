import './MyFeedback.css';

import { useEffect, useMemo, useState } from 'react';

import { GetAllFeedback } from '../../Api/EmployeeAccess';


const MyFeedback = () => {

  const token = localStorage.getItem('token');

  const [feedback, setFeedback] = useState([]);

  const [page, setPage] = useState(0);

  const [totalPages, setTotalPages] = useState(0);

  const [totalElements, setTotalElements] = useState(0);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState('');


  const pageSize = 5;


  // --------------------------------------------------
  // Fetch Feedback
  // --------------------------------------------------

  const fetchFeedback = async (pageNumber = page) => {

    try {

      setLoading(true);
      setError('');

      const response = await GetAllFeedback(
        token,
        pageNumber,
        pageSize
      );

      const data = response?.data;

      setFeedback(data?.content || []);

      setTotalPages(data?.totalPages || 0);

      setTotalElements(data?.totalElements || 0);

      setPage(data?.number ?? pageNumber);

    } catch (error) {

      console.error(
        'Error fetching feedback:',
        error
      );

      setError(
        error?.response?.data?.message ||
        'Unable to load your feedback.'
      );

    } finally {

      setLoading(false);

    }

  };


  useEffect(() => {

    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchFeedback(0);

  }, []);


  // --------------------------------------------------
  // Score Helpers
  // --------------------------------------------------

  const getScore = (score) => {

    const value = Number(score);

    if (Number.isNaN(value)) {
      return 0;
    }

    return value;

  };


  const getScorePercentage = (score) => {

    return Math.min(
      Math.max(getScore(score), 0),
      10
    ) * 10;

  };


  const getScoreLabel = (score) => {

    const value = getScore(score);

    if (value >= 9) {
      return 'Excellent';
    }

    if (value >= 7) {
      return 'Very Good';
    }

    if (value >= 5) {
      return 'Good';
    }

    if (value >= 3) {
      return 'Needs Improvement';
    }

    return 'Needs Attention';

  };


  // --------------------------------------------------
  // Average Score
  // --------------------------------------------------

  const averageScore = useMemo(() => {

    if (!feedback.length) {
      return 0;
    }

    const total = feedback.reduce(
      (sum, item) => {

        return sum +
          getScore(item.communicationScore) +
          getScore(item.teamworkScore) +
          getScore(item.helpfullnessScore) +
          getScore(item.knowledgeSharingScore);

      },
      0
    );

    return total / (feedback.length * 4);

  }, [feedback]);


  // --------------------------------------------------
  // Score Configuration
  // --------------------------------------------------

  const scoreDetails = [

    {
      label: 'Communication',
      key: 'communicationScore',
      short: 'C'
    },

    {
      label: 'Teamwork',
      key: 'teamworkScore',
      short: 'T'
    },

    {
      label: 'Helpfulness',
      key: 'helpfullnessScore',
      short: 'H'
    },

    {
      label: 'Knowledge Sharing',
      key: 'knowledgeSharingScore',
      short: 'K'
    }

  ];


  // --------------------------------------------------
  // Pagination
  // --------------------------------------------------

  const handlePrevious = () => {

    if (page > 0 && !loading) {

      fetchFeedback(page - 1);

    }

  };


  const handleNext = () => {

    if (
      page < totalPages - 1 &&
      !loading
    ) {

      fetchFeedback(page + 1);

    }

  };


  // --------------------------------------------------
  // Render
  // --------------------------------------------------

  return (

    <div className="myFeedbackOuter">


      {/* -----------------------------------------
          HEADER
      ----------------------------------------- */}

      <div className="myFeedbackHeader">

        <div>

          <span className="myFeedbackEyebrow">
            EMPLOYEE PORTAL
          </span>

          <h1>
            My Feedback
          </h1>

          <p>
            Review the feedback and performance scores
            you have received.
          </p>

        </div>

      </div>


      {/* -----------------------------------------
          ERROR
      ----------------------------------------- */}

      {error && (

        <div className="feedbackError">

          <span>!</span>

          {error}

        </div>

      )}


      {/* -----------------------------------------
          SUMMARY
      ----------------------------------------- */}

      {!loading && feedback.length > 0 && (

        <div className="feedbackSummary">


          {/* Average */}

          <div className="averageCard">

            <div>

              <span className="summaryLabel">
                AVERAGE SCORE
              </span>

              <div className="averageScoreRow">

                <strong>
                  {averageScore.toFixed(1)}
                </strong>

                <span>
                  / 10
                </span>

              </div>

              <p>
                {getScoreLabel(averageScore)}
              </p>

            </div>


            <div className="averageCircle">

              <div
                className="averageCircleInner"
                style={{
                  '--score':
                    `${averageScore * 36}deg`
                }}
              >
                {averageScore.toFixed(1)}
              </div>

            </div>

          </div>


          {/* Score Overview */}

          <div className="scoreOverview">

            <div className="scoreOverviewHeader">

              <div>

                <span className="summaryLabel">
                  PERFORMANCE OVERVIEW
                </span>

                <h2>
                  Your Key Areas
                </h2>

              </div>

              <span className="feedbackTotal">
                {totalElements} Feedback
              </span>

            </div>


            <div className="scoreOverviewGrid">

              {scoreDetails.map((item) => {

                const values = feedback.map(
                  feedbackItem =>
                    getScore(
                      feedbackItem[item.key]
                    )
                );

                const average =
                  values.length
                    ? values.reduce(
                        (a, b) => a + b,
                        0
                      ) / values.length
                    : 0;

                return (

                  <div
                    className="overviewScore"
                    key={item.key}
                  >

                    <div className="overviewTop">

                      <span>
                        {item.label}
                      </span>

                      <strong>
                        {average.toFixed(1)}
                      </strong>

                    </div>

                    <div className="scoreBar">

                      <div
                        className="scoreBarFill"
                        style={{
                          width:
                            `${getScorePercentage(
                              average
                            )}%`
                        }}
                      ></div>

                    </div>

                  </div>

                );

              })}

            </div>

          </div>

        </div>

      )}


      {/* -----------------------------------------
          FEEDBACK LIST
      ----------------------------------------- */}

      <div className="feedbackContainer">


        <div className="feedbackContainerHeader">

          <div>

            <span className="sectionLabel">
              PERFORMANCE REVIEWS
            </span>

            <h2>
              Feedback History
            </h2>

            <p>
              Feedback provided by your reviewers.
            </p>

          </div>


          {!loading && totalElements > 0 && (

            <div className="feedbackCount">
              {totalElements} Reviews
            </div>

          )}

        </div>


        {/* -----------------------------------------
            LOADING
        ----------------------------------------- */}

        {loading ? (

          <div className="feedbackLoading">

            <div className="feedbackSpinner"></div>

            <span>
              Loading feedback...
            </span>

          </div>

        ) : feedback.length === 0 ? (

          /* -----------------------------------------
             EMPTY
          ----------------------------------------- */

          <div className="feedbackEmpty">

            <div className="feedbackEmptyIcon">
              ★
            </div>

            <h3>
              No feedback available
            </h3>

            <p>
              You haven't received any feedback yet.
            </p>

          </div>

        ) : (

          <div className="feedbackList">

            {feedback.map((item) => {

              const overall =
                (
                  getScore(item.communicationScore) +
                  getScore(item.teamworkScore) +
                  getScore(item.helpfullnessScore) +
                  getScore(item.knowledgeSharingScore)
                ) / 4;

              return (

                <div
                  className="feedbackCard"
                  key={item.id}
                >


                  {/* Card Header */}

                  <div className="feedbackCardHeader">

                    <div className="reviewerInfo">

                      <div className="reviewerAvatar">

                        {item.reviewedBy
                          ? item.reviewedBy
                              .charAt(0)
                              .toUpperCase()
                          : '?'
                        }

                      </div>


                      <div>

                        <span className="reviewedLabel">
                          REVIEWED BY
                        </span>

                        <h3>
                          {item.reviewedBy || '--'}
                        </h3>

                      </div>

                    </div>


                    <div className="overallScore">

                      <span>
                        OVERALL
                      </span>

                      <strong>
                        {overall.toFixed(1)}
                      </strong>

                      <small>
                        /10
                      </small>

                    </div>

                  </div>


                  {/* Score Grid */}

                  <div className="feedbackScoreGrid">

                    {scoreDetails.map((scoreItem) => {

                      const score =
                        getScore(
                          item[scoreItem.key]
                        );

                      return (

                        <div
                          className="feedbackScore"
                          key={scoreItem.key}
                        >

                          <div className="feedbackScoreTop">

                            <span>
                              {scoreItem.label}
                            </span>

                            <strong>
                              {score.toFixed(1)}
                            </strong>

                          </div>


                          <div className="scoreBar">

                            <div
                              className="scoreBarFill"
                              style={{
                                width:
                                  `${getScorePercentage(
                                    score
                                  )}%`
                              }}
                            ></div>

                          </div>

                        </div>

                      );

                    })}

                  </div>


                  {/* Comments */}

                  <div className="feedbackComment">

                    <span>
                      COMMENTS
                    </span>

                    <p>
                      {item.comments?.trim()
                        ? item.comments
                        : 'No comments provided.'
                      }
                    </p>

                  </div>

                </div>

              );

            })}

          </div>

        )}


        {/* -----------------------------------------
            PAGINATION
        ----------------------------------------- */}

        {!loading &&
          totalPages > 0 && (

          <div className="feedbackPagination">


            <div className="paginationInfo">

              Showing page{' '}

              <strong>
                {page + 1}
              </strong>

              {' '}of{' '}

              <strong>
                {totalPages}
              </strong>

            </div>


            <div className="paginationButtons">

              <button
                onClick={handlePrevious}
                disabled={
                  page === 0 ||
                  loading
                }
              >
                ← Previous
              </button>


              <div className="pageNumber">
                {page + 1}
              </div>


              <button
                onClick={handleNext}
                disabled={
                  page >= totalPages - 1 ||
                  loading
                }
              >
                Next →
              </button>

            </div>

          </div>

        )}

      </div>

    </div>

  );

};


export default MyFeedback;