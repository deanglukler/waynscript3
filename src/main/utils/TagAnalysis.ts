import _ from 'lodash';
import path from 'path';
import { insertTags } from '../db/tags';
import { TagType, Tag } from '../types';

export class TagAnalysis {
  static analyze(paths: string[]) {
    const foundTags: Tag[] = [];
    paths.forEach((filePath) => {
      const { name } = path.parse(filePath);
      const tags = findTags(name, filePath);
      if (!_.isEmpty(_.keys(tags))) {
        Object.entries(tags).forEach(([tagType, value]) => {
          foundTags.push({ tagType: tagType as TagType, path: value.path });
        });
      }
    });
    insertTags(foundTags);
  }
}

function findTags(fileName: string, filePath: string) {
  // can have multiple tags
  const tags: { [key in TagType]?: { path: string } } = {};

  // test each tagType
  tagData.forEach(({ tagType, possibleMatches }) => {
    let foundTagType = false;
    possibleMatches.forEach((regex) => {
      if (foundTagType) return;
      if (regex.test(fileName)) {
        foundTagType = true;
        tags[tagType] = { path: filePath };
      }
    });
  });
  return tags;
}

const tagData: { tagType: TagType; possibleMatches: RegExp[] }[] = [
  {
    tagType: 'kick',
    possibleMatches: [
      /kick(?!in)[zs]?\d*/i,
      /\bkick[zs]?\d*\b/i,
      /\bbassdrum[zs]?\d*\b/i,
    ],
  },
  {
    tagType: 'clap',
    possibleMatches: [/\bcla?p/i, /cla?p[zs]?\d*\b/i],
  },
];
