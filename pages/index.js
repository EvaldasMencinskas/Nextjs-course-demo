import Head from "next/head";
import MeetupList from "../components/meetups/MeetupList";
import { MongoClient } from "mongodb";
import { Fragment } from "react";

function HomePage({ meetups }) {
  return (
    <Fragment>
      <Head>
        <title>React Meetups</title>
        <meta
          name="description"
          content="Browse a huge list of highly active React meetups!"
        />
      </Head>
      <MeetupList meetups={meetups} />
    </Fragment>
  );
}

export async function getStaticProps() {
  let client;

  try {
    client = await MongoClient.connect(
      "mongodb+srv://EvaldasTest:0ZLhsfkwot0CuqVZ@cluster0.wo9dz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    );
  } catch (err) {
    console.error("MongoDB connection failed:", err);
    return {
      props: { meetups: [] },
      revalidate: 10,
    };
  }

  const db = client.db();
  const meetupsCollection = db.collection("meetups");

  let meetups = [];

  try {
    const result = await meetupsCollection.find().toArray();
    meetups = result.map((meetup) => ({
      id: meetup._id.toString(),
      title: meetup.title,
      address: meetup.address,
      image: meetup.image,
    }));
  } catch (err) {
    console.error("Error fetching meetups:", err);
  } finally {
    client.close();
  }

  return {
    props: { meetups },
    revalidate: 10,
  };
}

export default HomePage;
