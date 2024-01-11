import json

import confluent_kafka as _a

producer_conf = {'bootstrap.servers': 'broker:9094', 'client.id': 'my-app'}
consumer_conf = {'bootstrap.servers': 'broker:9094', 'group.id': 'my-group', 'auto.offset.reset': 'latest'}
consumer_conf1 = {'bootstrap.servers': 'broker:9094', 'group.id': 'my-group1', 'auto.offset.reset': 'earliest'}
producer = _a.Producer(producer_conf)
consumer = _a.Consumer(consumer_conf)
consumer1 = _a.Consumer(consumer_conf1)

async def consume(topic):
    if topic == "topic1":
        consumer.subscribe([topic])
        try:
            while True:
                msg = consumer.poll(1.0)
                if msg is None:
                    continue
                if msg.error():
                    if msg.error().code() == _a.KafkaError._PARTITION_EOF:
                        continue
                    else:
                        print(f"Consumer error: {msg.error()}")
                        break
                msg_value = msg.value().decode('utf-8')
                if msg_value:
                    print(msg_value)
                    yield msg_value
        except KeyboardInterrupt:
            pass
        # finally:
        #     consumer.close()
    elif topic == "topic2":
        consumer1.subscribe([topic])
        try:
            while True:
                msg = consumer1.poll(1.0)
                if msg is None:
                    continue
                if msg.error():
                    if msg.error().code() == _a.KafkaError._PARTITION_EOF:
                        continue
                    else:
                        print(f"Consumer error: {msg.error()}")
                        break
                msg_value = msg.value().decode('utf-8')
                if msg_value:
                    try:
                        data = json.loads(msg_value)
                        yield data
                    except json.JSONDecodeError as e:
                        print(f"Error decoding JSON: {e}")
        except KeyboardInterrupt:
            pass
        # finally:
        #     consumer1.close()

async def produce(topic, data: dict):
    try:
        data = json.dumps(data).encode('utf-8')
        producer.produce(topic, value=data)
        producer.flush()
    except Exception as e:
        print(f"Failed to publish message to Kafka: {e}")
    