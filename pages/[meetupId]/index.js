import { MongoClient, ObjectId } from "mongodb";
import Head from "next/head";

function MeetupDetail({ meetupData }) {
  if (!meetupData) return <p>Meetup not found.</p>;

  return (
    <>
      <Head>
        <title>{meetupData.title}</title>
        <meta name="description" content={meetupData.description} />
      </Head>
      <section>
        <img
          src={meetupData.image}
          alt={meetupData.title}
          style={{
            width: "100%",
            maxHeight: "400px",
            objectFit: "cover",
            borderRadius: "6px",
            marginBottom: "1rem",
          }}
        />
        <h1>{meetupData.title}</h1>
        <address>{meetupData.address}</address>
        <p>{meetupData.description}</p>
      </section>
    </>
  );
}

export async function getStaticPaths() {
  const client = await MongoClient.connect(
    "mongodb+srv://EvaldasTest:0ZLhsfkwot0CuqVZ@cluster0.wo9dz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
  );
  const db = client.db();
  const meetupsCollection = db.collection("meetups");

  const meetups = await meetupsCollection
    .find({}, { projection: { _id: 1 } })
    .toArray();
  client.close();

  return {
    fallback: "blocking",
    paths: meetups.map((meetup) => ({
      params: { meetupId: meetup._id.toString() },
    })),
  };
}

export async function getStaticProps(context) {
  const meetupId = context.params.meetupId;

  if (!meetupId || meetupId.length !== 24) {
    return { notFound: true };
  }

  const client = await MongoClient.connect(
    "mongodb+srv://EvaldasTest:0ZLhsfkwot0CuqVZ@cluster0.wo9dz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
  );
  const db = client.db();
  const meetupsCollection = db.collection("meetups");

  let selectedMeetup = null;

  try {
    selectedMeetup = await meetupsCollection.findOne({
      _id: new ObjectId(meetupId),
    });
  } catch (err) {
    client.close();
    return { notFound: true };
  }

  client.close();

  if (!selectedMeetup) {
    return { notFound: true };
  }

  return {
    props: {
      meetupData: {
        id: selectedMeetup._id.toString(),
        title: selectedMeetup.title,
        image: selectedMeetup.image,
        address: selectedMeetup.address,
        description: selectedMeetup.description,
      },
    },
  };
}

export default MeetupDetail;
