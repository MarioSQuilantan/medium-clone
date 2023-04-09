import type { NextPage } from 'next';
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useState, useEffect, useCallback } from "react";
import {Text} from "@nextui-org/react";
import ArticleCard from '../../components/ArticleCard';

const MainFeed: NextPage = () => {
    const supabaseClient = useSupabaseClient();
    const user = useUser();
    const router = useRouter();
    const [articles, setArticles] = useState<any[]>([]);

  const getArticles = useCallback(async () => {
    try {
      const { data, error } = await supabaseClient.from("articles").select("*").limit(10);
          
      if(data != null) {
        setArticles(data);
      }
    } catch (error: any) {
      alert(error.message);
    }
  }, [supabaseClient]);

  useEffect(() => {
    getArticles();
  }, [getArticles]);

  return (
    <>
      <Text h2>Main Feed</Text>
      <Text size="$lg" css={{my: "$8"}}>
        Check out articles from users here
      </Text>
      {articles.map((article, i) => (
        <ArticleCard key={i} article={article}/>
      ))}
    </>
  )
}

export default MainFeed;