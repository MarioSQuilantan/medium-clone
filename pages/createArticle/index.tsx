import { GetServerSidePropsContext, NextPage } from "next";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import {useRouter} from 'next/router'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { Button, Grid, Text, Textarea } from "@nextui-org/react";
import { useState } from 'react'

const CreateArticle: NextPage = () => {
  const supabaseClient = useSupabaseClient();
  const user = useUser();
  const router = useRouter();

  const initialState = {
    title: '',
    content: '',
  }

  const [articleData, setArticleData] = useState(initialState);

  const onHandleChange = (e: any) => {
    setArticleData({...articleData, [e.target.name]: e.target.value});
  }

  const onCreateArticle = async () => {
    try {
      const {data, error} = await supabaseClient.from('articles').insert([{
        title: articleData.title,
        content: articleData.content,
        user_email: user?.email?.toLocaleLowerCase(),
        user_id: user?.id,
      }]).single()

      if (error) throw error;

      setArticleData(initialState);

    } catch (error: any) {
      alert(error.message);
    }
  }

  console.log(articleData);
  

  return (
    <Grid.Container gap={1}>
      <Text h3>Title</Text>
      <Grid xs={12}>
        <Textarea name={'title'} aria-label={'title'} placeholder={'Article Title'} fullWidth={true} rows={1} size={'xl'} onChange={onHandleChange}>
        </Textarea>
      </Grid>
      <Text h3>Article Text</Text>
      <Grid xs={12}>
        <Textarea name={'content'} aria-label={'content'} placeholder={'Article Text'} fullWidth={true} rows={6} size={'xl'} onChange={onHandleChange}>
        </Textarea>
      </Grid>
      <Grid xs={12}>
        <Text>Posting as {user?.email}</Text>
      </Grid>
      <Button onPress={onCreateArticle}>Create Article</Button>
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

export default CreateArticle;