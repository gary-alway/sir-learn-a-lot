import { Arg, Mutation, Query, Resolver } from 'type-graphql'
import { trackRepository } from '../constants'
import { Track, TrackInput } from './track'

@Resolver(Track)
export class TrackResolver {
  @Query(() => Track, { nullable: true })
  async getTrack(@Arg('id') id: string): Promise<Track | undefined> {
    return trackRepository.getTrackById(id)
  }

  @Mutation(() => Track)
  async addTrack(@Arg('TrackInput') { name }: TrackInput): Promise<Track> {
    return trackRepository.saveTrack({ name })
  }
}
