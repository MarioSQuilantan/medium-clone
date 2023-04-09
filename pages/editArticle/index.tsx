import { GetServerSidePropsContext, NextPage } from "next";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import {useRouter} from 'next/router'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { Button, Grid, Text, Textarea } from "@nextui-org/react";
import { useCallback, useEffect, useState } from 'react'

const EditArticle: NextPage = () => {
  const supabaseClient = useSupabaseClient();
  const user = useUser();
  const router = useRouter();
  const { id } = router.query;

  const initialState = {
    title: '',
    content: '',
  }

  const [articleData, setArticleData] = useState<any>(initialState);


  const getArticle = useCallback(async () => {
    try {
      const {data, error} = await supabaseClient.from('articles').select('*').filter('id', 'eq', id).single();
      if (error) throw error;
      setArticleData(data);
      
    } catch (error: any) {
      alert(error.message);
    }
  },[id, supabaseClient]);
  
  useEffect(() => {
    if (typeof id !== 'undefined') {
      getArticle();
    }
  }, [id, getArticle]);

  const onHandleChange = (e: any) => {
    setArticleData({...articleData, [e.target.name]: e.target.value});
  }

  const onEditArticle = async () => {
    try {
      const {data, error} = await supabaseClient.from('articles').update([{
        title: articleData.title,
        content: articleData.content,
      }]).eq('id', id);

      if (error) throw error;
      router.push(`/article?id=${id}`);

    } catch (error: any) {
      alert(error.message);
    }
  }

  return (
    <Grid.Container gap={1}>
      <Text h3>Title</Text>
      <Grid xs={12}>
        <Textarea initialValue={articleData.title} name={'title'} aria-label={'title'} placeholder={'Article Title'} fullWidth={true} rows={1} size={'xl'} onChange={onHandleChange}>
        </Textarea>
      </Grid>
      <Text h3>Article Text</Text>
      <Grid xs={12}>
        <Textarea initialValue={articleData.content} name={'content'} aria-label={'content'} placeholder={'Article Text'} fullWidth={true} rows={6} size={'xl'} onChange={onHandleChange}>
        </Textarea>
      </Grid>
      <Grid xs={12}>
        <Text>Posting as {user?.email}</Text>
      </Grid>
      <Button onPress={onEditArticle}>Update Article</Button>
    </Grid.Container>
  )
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const supabase = createServerSupabaseClient(ctx)
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session)
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }

  return {
    props: {
      initialSession: session,
      user: session.user,
    },
  }
}

export default EditArticle;