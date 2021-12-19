export interface PeopleProps {
  age: number | undefined;
  disabled: string;
  gender: string;
  name: string;
  race: string;
  unhouseSince: string;
}

export interface CampDetailsProps {
  description: string;
  name: string;
  numOfPeople: number;
  numOfPet: number;
  type: number;
}
