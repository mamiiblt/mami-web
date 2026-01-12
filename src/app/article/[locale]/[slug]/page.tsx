import {getSessionId} from "@/lib/articles/sessionIdCookie";
import getArticle, {GetArticleResponse} from "@/lib/articles/getArticle";
import {ResponseStatus} from "@/lib/articles/consts";
import PostNotFound from "@/components/articles/PostNotFound";
import ErrorWhileLoadingContent from "@/components/articles/ErrorWhileLoadingContent";
import ArticlePostContent from "@/app/article/[locale]/[slug]/ArticlePostContent";
import getComments, {GetCommentResponse} from "@/lib/articles/getComments";

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string, slug: string }>;
}) {
  const { slug, locale } = await params;
  const sessionId = await getSessionId()

  const payload = {
    article_id: slug,
    locale,
    session_id: sessionId
  }

  const postResponse: GetArticleResponse = await getArticle(payload)
  const commentsResponse= await getComments({
    id_a: postResponse.data.articleData.id_a,
    sid: postResponse.data.gen.sid,
    page: 1
  })

  if (postResponse.status == ResponseStatus.NOT_FOUND) {
    return <PostNotFound />
  }

  if (postResponse.status == ResponseStatus.FAILURE) {
    return <ErrorWhileLoadingContent
      title={"An error occurred while fetching article"}
      desc={postResponse.desc ?? "No any error message"}
    />
  }

  return (
      <ArticlePostContent post={postResponse} slug={slug} session_id={sessionId} fetchComments={commentsResponse} />
  )
}
