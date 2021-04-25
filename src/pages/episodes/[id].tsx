import { GetStaticPaths, GetStaticProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { api } from '../../services/api';
import { convertIsoDateToLocalizedString } from '../../utils/convertIsoDateToLocalizedString';
import { convertSecondsToTimeString } from '../../utils/convertSecondsToTimeString';

import styles from './episode.module.scss';

type Episode = {
  id: string;
  title: string;
  members: string;
  publishedAt: string;
  thumbnail: string;
  description: string;
  url: string;
  durationString: string;
  duration: number;
}

type EpisodeProps = {
  episode: Episode;
}

export default function Episode({ episode }: EpisodeProps) {
  return (
    <div className={styles.episode}>
      <div className={styles.thumbnailContainer}>
        <Link href="/">
          <button type="button">
            <img src="/arrow-left.svg" alt="Voltar"/>
          </button>
        </Link>
        <Image
          src={episode.thumbnail}
          width={700}
          height={160}
          objectFit="cover"
        />
        <button type="button">
          <img src="/play.svg" alt="Tocar episódio"/>
        </button>
      </div>

      <header>
        <h1>{episode.title}</h1>
        <span>{episode.members}</span>
        <span>{episode.publishedAt}</span>
        <span>{episode.durationString}</span>
      </header>

      <div className={styles.episodeDescription} dangerouslySetInnerHTML={{ __html: episode.description }}/>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async (context) => {
  const { id } = context.params;

  const { data } = await api.get(`episodes/${id}`);

  const episode = {
    id: data.id,
    title: data.title,
    members: data.members,
    publishedAt: convertIsoDateToLocalizedString(data.published_at),
    thumbnail: data.thumbnail,
    description: data.description,
    url: data.file.url,
    durationString: convertSecondsToTimeString(data.file.duration),
    duration: data.file.duration,
  };

  return {
    props: { episode },
    revalidate: 3600 * 24,
  }
}
