/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: MIT-0
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this
 * software and associated documentation files (the "Software"), to deal in the Software
 * without restriction, including without limitation the rights to use, copy, modify,
 * merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
 * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

package com.amazon.sample.carts.web;

import com.amazon.sample.carts.metrics.CartSreMetrics;
import com.amazon.sample.carts.services.CartService;
import com.amazon.sample.carts.web.api.Cart;
import com.amazon.sample.carts.web.api.Item;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Tag(name = "carts")
@RequestMapping(path = "/carts")
@Slf4j
public class CartsController {

  @Autowired
  private CartService service;

  @Autowired
  private CartSreMetrics cartSreMetrics;

  @ResponseStatus(HttpStatus.OK)
  @GetMapping(
    value = "/{customerId}",
    produces = MediaType.APPLICATION_JSON_VALUE
  )
  @Operation(summary = "Retrieve a cart", operationId = "getCart")
  public Cart get(@PathVariable String customerId) {
    return cartSreMetrics.recordRequest("get_cart", "GET", () ->
      Cart.from(this.service.get(customerId))
    );
  }

  @ResponseStatus(HttpStatus.ACCEPTED)
  @DeleteMapping(
    value = "/{customerId}",
    produces = MediaType.APPLICATION_JSON_VALUE
  )
  @Operation(summary = "Delete a cart", operationId = "deleteCart")
  public Cart delete(@PathVariable String customerId) {
    return cartSreMetrics.recordRequest("delete_cart", "DELETE", () -> {
      this.service.delete(customerId);

      return new Cart();
    });
  }

  @ResponseStatus(HttpStatus.ACCEPTED)
  @GetMapping(
    value = "/{customerId}/merge",
    produces = MediaType.APPLICATION_JSON_VALUE
  )
  @Operation(summary = "Merge two carts contents", operationId = "mergeCarts")
  public void mergeCarts(
    @PathVariable String customerId,
    @RequestParam(value = "sessionId") String sessionId
  ) {
    cartSreMetrics.recordRequest("merge_carts", "GET", () ->
      this.service.merge(sessionId, customerId)
    );
  }

  @ResponseStatus(HttpStatus.OK)
  @GetMapping(
    value = "/{customerId}/items/{itemId:.*}",
    produces = MediaType.APPLICATION_JSON_VALUE
  )
  @Operation(summary = "Retrieve an item from a cart", operationId = "getItem")
  public Item get(
    @PathVariable String customerId,
    @PathVariable String itemId
  ) {
    return cartSreMetrics.recordRequest("get_item", "GET", () ->
      this.service.item(customerId, itemId).map(Item::from).get()
    );
  }

  @ResponseStatus(HttpStatus.OK)
  @GetMapping(
    value = "/{customerId}/items",
    produces = MediaType.APPLICATION_JSON_VALUE
  )
  @Operation(summary = "Retrieve items from a cart", operationId = "getItems")
  public List<Item> getItems(@PathVariable String customerId) {
    return cartSreMetrics.recordRequest("get_items", "GET", () ->
      this.service.items(customerId)
        .stream()
        .map(Item::from)
        .collect(Collectors.toList())
    );
  }

  @ResponseStatus(HttpStatus.CREATED)
  @PostMapping(
    value = "/{customerId}/items",
    produces = MediaType.APPLICATION_JSON_VALUE
  )
  @Operation(summary = "Add an item to a cart", operationId = "addItem")
  public Item addToCart(
    @PathVariable String customerId,
    @RequestBody Item item
  ) {
    return cartSreMetrics.recordRequest("add_item", "POST", () -> {
      Item added = Item.from(
        this.service.add(
            customerId,
            item.getItemId(),
            item.getQuantity(),
            item.getUnitPrice()
          )
      );

      cartSreMetrics.recordItemsAdded(item.getQuantity());

      return added;
    });
  }

  @ResponseStatus(HttpStatus.ACCEPTED)
  @DeleteMapping(
    value = "/{customerId}/items/{itemId:.*}",
    produces = MediaType.APPLICATION_JSON_VALUE
  )
  @Operation(summary = "Delete an item from a cart", operationId = "deleteItem")
  public void removeItem(
    @PathVariable String customerId,
    @PathVariable String itemId
  ) {
    cartSreMetrics.recordRequest("remove_item", "DELETE", () -> {
      this.service.deleteItem(customerId, itemId);
      cartSreMetrics.recordItemRemoved();
    });
  }

  @ResponseStatus(HttpStatus.ACCEPTED)
  @PatchMapping(
    value = "/{customerId}/items",
    produces = MediaType.APPLICATION_JSON_VALUE
  )
  @Operation(summary = "Update an item in a cart", operationId = "updateItem")
  public void updateItem(
    @PathVariable String customerId,
    @RequestBody Item item
  ) {
    cartSreMetrics.recordRequest("update_item", "PATCH", () ->
      this.service.update(
          customerId,
          item.getItemId(),
          item.getQuantity(),
          item.getUnitPrice()
        )
    );
  }
}
