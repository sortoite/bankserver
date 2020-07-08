import { MessageKeyRepository } from '../repositories';
import { Injectable } from '@nestjs/common';
import { InsertResult } from 'typeorm';
import { MessageKeyEntity } from '../entities';

@Injectable()
export class MessageKeyService {
  private readonly _messageKeys = [{ name: 'WELCOME_MESSAGE' }];

  constructor(private readonly _messageKeyRepository: MessageKeyRepository) {}

  public async getMessageKey(
    uuid: string,
  ): Promise<MessageKeyEntity | undefined> {
    const queryBuilder = this._messageKeyRepository.createQueryBuilder(
      'messageKey',
    );

    queryBuilder.where('messageKey.uuid = :uuid', { uuid });

    return queryBuilder.getOne();
  }

  public async setMessageKeys(): Promise<void> {
    const messageKeys = await this._getMessageKeys();

    for (const { name } of this._messageKeys) {
      if (messageKeys.find((messageKey) => messageKey.name === name)) {
        continue;
      }

      await this._createMessageKeys(name);
    }
  }

  private async _createMessageKeys(name: string): Promise<InsertResult> {
    const queryBuilder = this._messageKeyRepository.createQueryBuilder(
      'messageKey',
    );

    return queryBuilder.insert().values({ name }).execute();
  }

  private async _getMessageKeys(): Promise<MessageKeyEntity[] | undefined> {
    const queryBuilder = this._messageKeyRepository.createQueryBuilder(
      'messageKey',
    );

    return queryBuilder.getMany();
  }
}
