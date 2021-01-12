// item.controller.ts
import { Controller, Get, Post, Put, Delete, Body, Param, HttpException, HttpStatus } from '@nestjs/common'
import { ItemService } from './item.service'
import { Item } from '../entities/item.entity'
import { UpdateItemDTO, DeleteItemDTO } from './item.dto'
import { UpdateResult, DeleteResult } from 'typeorm'

@Controller('item')
export class ItemController {
  // サービスの呼び出し
  constructor(private readonly service: ItemService) {}

  // `item`のURIへのGETメソッドでデータ全件取得．サービスの`findAll()`関数を実行．
  @Get()
  async getItemList(): Promise<Item[]> {
    return await this.service.findAll()
  }

  @Put(':id/update')
  async update(@Param('id') id: string, @Body() itemData: UpdateItemDTO): Promise<UpdateResult> {
    const newData = !itemData.isDone
      ? itemData
      : {
          ...itemData,
          ...{ isDone: itemData.isDone.toLowerCase() === 'true' },
        }
    return await this.service.update(Number(id), newData)
  }
  // パスワードなしで即削除する処理（動作確認用）
  @Delete(':id/delete')
  async delete(@Param('id') id: string): Promise<DeleteResult> {
    return await this.service.delete(Number(id))
  }

  // POSTメソッドでパスワードを送信して削除する処理
  @Post(':id/delete')
  async deleteItem(@Param('id') id: string, @Body() deleteItem: DeleteItemDTO) {
    const item = this.service.find(Number(id))
    // idで検索したけど該当するアイテムが見つからなかったとき
    if (!item) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: `Missing item(id: ${id}).`,
        },
        404
      )
    }
    try {
      await this.service.deleteByPassword(Number(id), deleteItem.deletePassword)
    } catch (e) {
      // 送信したパスワードが間違っていたとき
      if (e.message === 'Incorrect password') {
        throw new HttpException(
          {
            status: HttpStatus.FORBIDDEN,
            error: 'Incorrect password',
          },
          403
        )
      }
      // パスワード合ってるけどなんかイマイチだったとき
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Internal server error.',
        },
        500
      )
    }
    return
  }

  // `item/id番号`のURIへのGETメソッドでid指定で1件データ取得．
  @Get(':id')
  async getItem(@Param('id') id: string): Promise<Item> {
    return await this.service.find(Number(id))
  }
}
