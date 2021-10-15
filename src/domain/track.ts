import { Field, InputType, ObjectType } from 'type-graphql'

@ObjectType()
export class Track {
  @Field()
  id!: string

  @Field()
  name!: string
}

@InputType()
export class TrackInput implements Partial<Track> {
  @Field()
  name!: string
}
