import { gql } from '@apollo/client';

export const GET_SKILL_LEVELS = gql`
  query getSkillLevels {
    skillLevels(orderBy: { rank: ASC }) {
      displayName
      id
      isDisplayed
      rank
    }
  }
`;

export const UPDATE_USER_TENNIS_SKILL_LEVEL = gql`
  mutation updateUserTennisSkillLevel($id: uuid!, $tennisSkillLevelId: String) {
    updateUsersByPk(pkColumns: { id: $id }, _set: { tennisSkillLevelId: $tennisSkillLevelId }) {
      id
      tennisSkillLevelId
    }
  }
`;

export const UPDATE_USER_PICKLEBALL_SKILL_LEVEL = gql`
  mutation updateUserPickleballSkillLevel($id: uuid!, $pickleballSkillLevelId: String) {
    updateUsersByPk(
      pkColumns: { id: $id }
      _set: { pickleballSkillLevelId: $pickleballSkillLevelId }
    ) {
      id
      pickleballSkillLevelId
    }
  }
`;
