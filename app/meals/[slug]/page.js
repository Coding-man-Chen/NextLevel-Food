import { getMeal } from '@/lib/meals'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import classes from './page.module.css'

export const generateMetadata = async ({params}) => {
  const meal = getMeal(params.slug)
  if(!meal){
    notFound()
  }
  return {
    title: meal.title,
    description: meal.summary
  }
}
const MealPage = ({params}) => {
  const meal = getMeal(params.slug)
  if(!meal){
    notFound()
  }
  meal.instructions = meal.instructions.replace(/\n/g,'<br/>')
  return (
    <>
      <header className={classes.header}>
        <div className={classes.image}>
          <Image src={`https://runcong-chen-nextjs-demo-users-image.s3.eu-north-1.amazonaws.com/images/${meal.image}`} alt={meal.title} fill/>
        </div>
        <div className={classes.headerText}>
          <h1>{meal.title}</h1>
          <p className={classes.creator}>
            by <a href={`mailto: ${meal.creator_email}`}>{meal.creator}</a>
          </p>
          <p className={classes.summary}>{meal.summary}</p>
        </div>
      </header>
      <main>
        <p className={classes.instructions} dangerouslySetInnerHTML={{__html: meal.instructions}}></p>
      </main>
    </>
  )
}

export default MealPage
