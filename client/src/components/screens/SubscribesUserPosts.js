import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../App";
import { Link } from "react-router-dom";
const Home = () => {
  const [data, setData] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  useEffect(() => {
    fetch("/getsubpost", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setData(result.posts);
      });
  }, []);

  const likePost = (id) => {
    fetch("/like", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        //   console.log(result)
        const newData = data.map((item) => {
          if (item._id == result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const unlikePost = (id) => {
    fetch("/unlike", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        //   console.log(result)
        const newData = data.map((item) => {
          if (item._id == result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const makeComment = (text, postId) => {
    fetch("/comment", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId,
        text,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        const newData = data.map((item) => {
          if (item._id == result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deletePost = (postid) => {
    fetch(`/deletepost/${postid}`, {
      method: "delete",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        const newData = data.filter((item) => {
          return item._id !== result._id;
        });
        setData(newData);
      });
  };
  return (
    <div className="home">
      {data.map((item) => {
        return (
          <div className="card home-card" key={item._id}>
            <h5 style={{ padding: "5px", fontWeight: "bolder" }}>
              <Link
                to={
                  item.postedBy._id !== state._id
                    ? "/profile/" + item.postedBy._id
                    : "/profile"
                }
              >
                <img
                  className="comment-pic"
                  src={item.postedBy.pic}
                  alt={item.postedBy.name}
                />
                {item.postedBy.name}
              </Link>{" "}
              {item.postedBy._id == state._id && (
                <i
                  className="material-icons"
                  style={{
                    float: "right",
                  }}
                  onClick={() => deletePost(item._id)}
                >
                  delete
                </i>
              )}
            </h5>
            <div className="card-image">
              <img src={item.photo} />
            </div>
            <div className="card-content">
              <h6>
                {item.likes.includes(state._id) ? (
                  <i
                    className="material-icons"
                    style={{ color: "red" }}
                    onClick={() => {
                      unlikePost(item._id);
                    }}
                  >
                    favorite
                  </i>
                ) : (
                  <i
                    className="material-icons"
                    style={{ color: "red" }}
                    onClick={() => {
                      likePost(item._id);
                    }}
                  >
                    favorite_border
                  </i>
                )}
                {item.likes.length} likes
              </h6>

              <h6 style={{ fontWeight: "bold" }}>{item.title}</h6>
              <p>{item.body}</p>
              {item.comments.map((record) => {
                return (
                  <h6 key={record._id}>
                    <Link
                      to={
                        record.postedBy._id !== state._id
                          ? "/profile/" + record.postedBy._id
                          : "/profile"
                      }
                    >
                      <img
                        className="comment-pic"
                        src={record.postedBy.pic}
                        alt={record.postedBy.name}
                      />
                      <span style={{ fontWeight: "500" }}>
                        {record.postedBy.name}
                      </span>{" "}
                    </Link>

                    {record.text}
                  </h6>
                );
              })}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  makeComment(e.target[0].value, item._id);
                }}
              >
                <input type="text" placeholder="add a comment" />
              </form>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Home;
