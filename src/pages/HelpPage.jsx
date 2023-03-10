import { useState, useEffect } from "react";
import ReactPlayer from "react-player";
import { getVideos, getPosts } from "../api/ContentService";
import Loading from "../UI/Loading";
import { BsChevronRight, BsChevronDown } from "react-icons/bs";

function HelpPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [videos, setVideos] = useState([]);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getVideos(setIsLoading, setVideos);
    getPosts(setIsLoading, setPosts);
  }, []);

  const handleOpening = (index) => {
    const temp = [...posts];
    temp[index].visible = !temp[index].visible;
    setPosts(temp);
  };

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Loading which={0} />
        <p style={{ marginTop: 15 }}>Загрузка...</p>
      </div>
    );
  }
  return (
    <div>
      <div className="HelpVideos">
        {videos.map((item) => {
          return (
            <div key={item.id} className="VideoWrapper">
              <p>{item.title}</p>
              {item.videourl ? (
                <ReactPlayer
                  style={{
                    marginBottom: "20px",
                  }}
                  width="100%"
                  url={item.videourl}
                  controls
                />
              ) : (
                ""
              )}
            </div>
          );
        })}
      </div>
      <div className="FAQ">
        <h3 style={{ textAlign: "center", marginBottom: "20px" }}>
          FAQ - Вопросы и ответы
        </h3>
        {posts.map((item, index) => {
          return (
            <div key={item.id} clasname="PostWrapper">
              <div onClick={() => handleOpening(index)} className="TitleButton">
                <p className="PostTitle">{index + 1 + ". " + item.title}</p>
                {item.visible ? <BsChevronDown /> : <BsChevronRight />}
              </div>
              <div
                className={`PostContent ${item.visible ? "PostVisible" : ""}`}
              >
                {item.videourl ? (
                  <ReactPlayer
                    style={{
                      marginBottom: "20px",
                    }}
                    width="100%"
                    url={item.videourl}
                    controls
                  />
                ) : (
                  ""
                )}
                <img src={item.imgurl} alt="" />
                <p>{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default HelpPage;
