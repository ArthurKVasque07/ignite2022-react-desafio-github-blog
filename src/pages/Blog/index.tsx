import { useCallback, useEffect, useState } from "react";
import { Spinner } from "../../components/Spinner";
import { Post } from "../../components/_blogPage/Post";
import { Profile } from "../../components/_blogPage/Profile";
import { SearchInput } from "../../components/_blogPage/SearchInput";
import { api } from "../../lib/axios";
import { PostsListContainer } from "./styles";

const username = import.meta.env.VITE_GITHUB_USERNAME;
const repoName = import.meta.env.VITE_GITHUB_REPONAME;

export interface IPost {
  title: string;
  body: string;
  created_at: string;
  number: number;
  html_url: string;
  comments: number;
  user: {
    login: string;
  };
}

export function Blog() {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getPosts = useCallback(
    async (query: string = "") => {
      try {
        setIsLoading(true);
        const response = await api.get(
          `/search/issues?q=${query}%20label:published%20repo:GBDev13/${repoName}`
        );

        setPosts(response.data.items);
      } finally {
        setIsLoading(false);
      }
    },
    [posts]
  );

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <>
      <Profile />
      <SearchInput postsLength={posts.length} getPosts={getPosts} />
      {isLoading ? (
        <Spinner />
      ) : (
        <PostsListContainer>
          {posts.map((post) => (
            <Post key={post.number} post={post} />
          ))}
        </PostsListContainer>
      )}
    </>
  );
}