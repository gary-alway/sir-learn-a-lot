import {
  Arg,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root
} from 'type-graphql'
import { courseRepository, trackRepository } from '../constants'
import { Track, TrackInput } from './track'

@Resolver(Track)
export class TrackResolver {
  @Query(() => [Track], { nullable: true })
  async getTracks(): Promise<Track[]> {
    return trackRepository.getTracks()
  }

  @Query(() => Track, { nullable: true })
  async getTrack(@Arg('id') id: string): Promise<Track | undefined> {
    return trackRepository.getTrackById(id)
  }

  @Mutation(() => Track)
  async addTrack(@Arg('TrackInput') { name }: TrackInput): Promise<Track> {
    return trackRepository.saveTrack({ name })
  }

  @FieldResolver()
  courses(@Root() track: Track) {
    return courseRepository.getCoursesByTrackId(track.id)
  }
}
