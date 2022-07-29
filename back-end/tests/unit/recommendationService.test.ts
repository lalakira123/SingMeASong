import { jest } from '@jest/globals';

import { CreateRecommendationData, recommendationService } from '../../src/services/recommendationsService.js';
import { recommendationRepository } from '../../src/repositories/recommendationRepository.js';
import { conflictError, notFoundError } from '../../src/utils/errorUtils.js';

describe('Recommendation test suites', () => {
  it('should insert a new recommendation', async () => {
    jest.spyOn(recommendationRepository, 'findByName').mockImplementationOnce(():any => {});
    jest.spyOn(recommendationRepository, 'create').mockImplementationOnce(():any => {});

    const recommendation : CreateRecommendationData = {
      name: 'beibei',
      youtubeLink: 'https://www.youtube.com/watch?v=XtiYktqTVWs'
    }

    await recommendationService.insert(recommendation);
    expect(recommendationRepository.create).toBeCalled();
  });

  it('should not insert a new recommendation and throw an error', async () => {
    const recommendation : CreateRecommendationData = {
      name: 'Beibei',
      youtubeLink: 'https://www.youtube.com/watch?v=XtiYktqTVWs'
    };

    jest.spyOn(recommendationRepository, 'findByName').mockImplementationOnce(():any => {
      return {
        id: 1,
        name: recommendation.name,
        youtubeLink: recommendation.youtubeLink,
        score: 2
      }
    });

    const promise = recommendationService.insert(recommendation);
    expect(promise).rejects.toEqual(conflictError('Recommendations names must be unique'));
  });

  it('should upvote', async () => {
    jest.spyOn(recommendationRepository, 'find').mockImplementationOnce(():any => {return {
      id: 1,
      name: 'beibei',
      youtubeLink: 'https://www.youtube.com/watch?v=XtiYktqTVWs',
      score: 1
    }});
    jest.spyOn(recommendationRepository, 'updateScore').mockImplementationOnce(():any => {});

    await recommendationService.upvote(1);
    expect(recommendationRepository.updateScore).toBeCalled();
  });

  it('should downvote', async () => {
    jest.spyOn(recommendationRepository, 'find').mockImplementationOnce(():any => {
      return {
        id: 1,
        name: 'beibe',
        youtubeLink: 'https://www.youtube.com/watch?v=XtiYktqTVWs',
        score: -3
      }
    });
    jest.spyOn(recommendationRepository, 'updateScore').mockImplementationOnce(():any => {
      return {
        id: 1,
        name: 'beibe',
        youtubeLink: 'https://www.youtube.com/watch?v=XtiYktqTVWs',
        score: -4
      }
    });

    await recommendationService.downvote(1);
    expect(recommendationRepository.updateScore).toBeCalled();
  });

  it('should downvote and delete', async () => {
    jest.spyOn(recommendationRepository, 'find').mockImplementationOnce(():any => {
      return {
        id: 1,
        name: 'beibe',
        youtubeLink: 'https://www.youtube.com/watch?v=XtiYktqTVWs',
        score: -5
      }
    });
    jest.spyOn(recommendationRepository, 'updateScore').mockImplementationOnce(():any => {
      return {
        id: 1,
        name: 'beibe',
        youtubeLink: 'https://www.youtube.com/watch?v=XtiYktqTVWs',
        score: -6
      }
    });
    jest.spyOn(recommendationRepository, 'remove').mockImplementationOnce(():any => {return true});

    await recommendationService.downvote(1);
    expect(recommendationRepository.remove).toBeCalled();
  });

  it('should get by id', async () => {
    jest.spyOn(recommendationRepository, 'find').mockImplementationOnce(():any => {return true});

    await recommendationService.getById(1);
    expect(recommendationRepository.find).toBeCalled();
  });

  it('should get by id and throw an error', async () => {
    jest.spyOn(recommendationRepository, 'find').mockImplementationOnce(():any => {});

    const promise = recommendationService.getById(1);
    expect(promise).rejects.toEqual(notFoundError());
  });

  it('should get all recommendations', async () => {
    jest.spyOn(recommendationRepository, 'findAll').mockImplementationOnce(():any => {});

    await recommendationService.get();
    expect(recommendationRepository.findAll).toBeCalled();
  });

  it('should get the top recommendations', async () => {
    jest.spyOn(recommendationRepository, 'getAmountByScore').mockImplementationOnce(():any => {});

    await recommendationService.getTop(1);
    expect(recommendationRepository.getAmountByScore).toBeCalled();
  });

  it('should get the random and exist on database', async () => {
    jest.spyOn(recommendationRepository, 'findAll').mockImplementationOnce(():any => {
      return [
        {id: 1, name: 'Beibei', youtubeLink: 'https://www.youtube.com/watch?v=XtiYktqTVWs', score: 3},
        {id: 1, name: 'Baibai', youtubeLink: 'https://www.youtube.com/watch?v=XtiYktqTVWs', score: 10}
      ]
    });

    await recommendationService.getRandom();
    expect(recommendationRepository.findAll).toBeCalled();
  });

  it('should get the random and throw an error', async () => {
    jest.spyOn(recommendationRepository, 'findAll').mockImplementationOnce(():any => {
        return []
    });
    jest.spyOn(recommendationRepository, 'findAll').mockImplementationOnce(():any => {
      return []
    });

    const promise = recommendationService.getRandom();
    expect(promise).rejects.toEqual(notFoundError());
  });

  it('getScoreFilter if hit the 30%', async () => {
    const random = 0.8;

    const result = recommendationService.getScoreFilter(random);
    expect(result).toEqual('lte');
  });

  it('getScoreFilter if hit the 70%', async () => {
    const random = 0.2;

    const result = recommendationService.getScoreFilter(random);
    expect(result).toEqual('gt');
  });
})