import _ from 'lodash';
import path from 'path';
import { Tag, TagType } from '../../types';
import { insertTags } from '../db/tags';

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
  {
    tagType: 'snare',
    possibleMatches: [/snare[zs]?/i, /\bsnare[zs]?\d*\b/i],
  },
  {
    tagType: 'snare_roll',
    possibleMatches: [/\broll/i, /roll[zs]?\d*\b/i],
  },
  {
    tagType: 'hihat',
    possibleMatches: [/(hi\s?)?hat[zs]?\d*/i, /\bhh\b/i, /hat[zs]?\d*\b/i],
  },
  {
    tagType: 'closed_hihat',
    possibleMatches: [
      /closed\s?(((hi)?\s?hat)[zs]?|(hh\b))/i,
      /((\bhh)|((hi)?\s?hat))[zs]?\s?closed/i,
      /\bclosed\s?(((hi)?\s?hat)|(hh\b))[zs]?\b/i,
      /\b((\bhh)|((hi)?\s?hat))[zs]?\s?closed\b/i,
      /(hi\s?)hat[zs]?\d*\(closed\)/i,
    ],
  },
  {
    tagType: 'open_hihat',
    possibleMatches: [
      /open\s?(((hi)?\s?hat)[zs]?|(hh\b))/i,
      /((\bhh)|((hi)?\s?hat))[zs]?\s?open/i,
      /\bopen\s?(((hi)?\s?hat)|(hh\b))[zs]?\b/i,
      /\b((\bhh)|((hi)?\s?hat))[zs]?\s?open\b/i,
      /(hi\s?)hat[zs]?\d*\(open\)/i,
    ],
  },

  {
    tagType: 'crash',
    possibleMatches: [/\bcrash[zs]?\d*\b/i],
  },
  {
    tagType: 'tom',
    possibleMatches: [/\btom[zs]?\d*\b/i],
  },
  {
    tagType: 'clave',
    possibleMatches: [/\bclave[zs]?\d*\b/i],
  },
  {
    tagType: 'perc',
    possibleMatches: [/\bperc(ussion)?[zs]?\d*/i],
  },
  {
    tagType: 'break',
    possibleMatches: [/\bbreak[zs]?\d*/i],
  },
  {
    tagType: 'ride',
    possibleMatches: [/\bride[zs]?\d*\b/i],
  },
  {
    tagType: 'shaker',
    possibleMatches: [/\bshaker[zs]?\d*\b/i],
  },
  {
    tagType: '808',
    possibleMatches: [/\b808[zs]?\d*\b/i],
  },
  {
    tagType: 'conga',
    possibleMatches: [/\bconga[zs]?\d*\b/i],
  },
  {
    tagType: 'rim',
    possibleMatches: [/\brim(shot)?[zs]?\d*\b/i],
  },
  {
    tagType: 'bongo',
    possibleMatches: [/\bbongo[zs]?\d*\b/i],
  },
  {
    tagType: 'tam',
    possibleMatches: [/\btam(b)?(ourine)?[zs]?\d*\b/i],
  },
  {
    tagType: 'snap',
    possibleMatches: [/\bsnap[zs]?\d*\b/i],
  },
  {
    tagType: 'fill',
    possibleMatches: [/\bfill[zs]?\d*\b/i],
  },
  {
    tagType: 'bell',
    possibleMatches: [/\bbell[zs]?\d*\b/i],
  },
  {
    tagType: 'cajon',
    possibleMatches: [/\bcajon[zs]?\d*\b/i],
  },
];
