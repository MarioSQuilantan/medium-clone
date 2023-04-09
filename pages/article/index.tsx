import { NextPage } from "next";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import {useRouter} from 'next/router'
import { Auth } from "@supabase/auth-ui-react";
import { useCallback, useEffect, useState} from 'react'
import { Button, Spacer, Text, User } from "@nextui-org/react";


const Article: NextPage = () => {
  const supabaseClient = useSupabaseClient();
  const user = useUser();
  const router = useRouter();
  const [article, setArticle] = useState<any>({});

  const { id } = router.query;

  const getArticle = useCallback(async () => {
    try {
      const {data, error} = await supabaseClient.from('articles').select('*').filter('id', 'eq', id).single();
      if (error) throw error;
      setArticle(data);
      
    } catch (error: any) {
      alert(error.message);
    }
  },[id, supabaseClient]);
  
  useEffect(() => {
    if (typeof id !== 'undefined') {
      getArticle();
    }
  }, [id, getArticle]);

  const deleteArticle = async () => {
    try {
      const {data, error} = await supabaseClient.from('articles').delete().eq('id', id);
      if (error) throw error;
      router.push('/mainFeed');
    } catch (error: any) {
      alert(error.message);
    }
  }

  return (
    <>
      <Text h2>{article.title}</Text>
      <Spacer y={.5}></Spacer>
      <User name={article.user_email?.toLowerCase()}></User>
      <Spacer y={1}></Spacer>
      <Text size={'$lg'}>{article.content}</Text>
      {
        user && article.user_id === user.id
          ? <>
            <Spacer y={.5}></Spacer>
            <Button size={'sm'} color={'warning'} onPress={() => router.push(`editArticle?id=${id}`)}>Edit</Button>
            <Spacer y={.5}></Spacer>
            <Button size={'sm'} color={'error'} onPress={() => deleteArticle()}>Delete</Button>
          </>
          : null
      }
    </>
  )
}

export default Article;