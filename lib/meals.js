import Database from "better-sqlite3";
import slugify from "slugify";
import xss from "xss";
import fs from "fs";
import { S3 } from '@aws-sdk/client-s3';

const s3 = new S3({
  region: 'eu-north-1'
});

const db = new Database(process.cwd() + "/meals.db");

const getMeals = async () => {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  // throw new Error('fail to fetch data')
  return db.prepare(`SELECT * FROM meals`).all();
};

const getMeal = (slug) => {
  return db.prepare(`SELECT * FROM meals WHERE slug = ?`).get(slug);
};

const saveMeal = async (meal) => {
  meal.slug = slugify(meal.title, { lower: true });
  meal.instructions = xss(meal.instructions);
  const extentsion = meal.image.name.split(".").pop();
  const filename = `${meal.slug}.${extentsion}`;
  // const stream = fs.createWriteStream(`public/images/${filename}`);
  const bufferImage = await meal.image.arrayBuffer();
  // stream.write(Buffer.from(bufferImage), (error) => {
  //   if (error) {
  //     throw new Error("Saving image failed!");
  //   }
  // });
  meal.image = `${filename}`;
  s3.putObject({
    Bucket: 'runcong-chen-nextjs-demo-users-image',
    Key: `images/${filename}`,
    Body: Buffer.from(bufferImage),
    ContentType: meal.image.type,
  });

  db.prepare(
    `
    INSERT INTO meals
      (title, slug, summary, instructions, creator, creator_email, image)
    VALUES (
      @title,
      @slug,
      @summary,
      @instructions,
      @creator,
      @creator_email,
      @image
    )
    `
  ).run(meal);
};

export { getMeals, getMeal, saveMeal };
